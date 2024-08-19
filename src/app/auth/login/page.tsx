"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import Image from 'next/image'
import { LOGIN_BASE_URL } from "../../../../config"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const baseUrl = LOGIN_BASE_URL;
    const loginUrl = `${baseUrl}/auth/v1/login`;

    const ob = {
      "email": values.email,
      "password": values.password
    }

    try {
      setIsLoading(true);
        // Send the signup request to your API
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ob),
        });

        if (response.ok) {
          setIsLoading(false);
            const data = await response.json();
            toast({
                title: "Success",
                description: "Login successful.",
            });
            localStorage.setItem("userId", data.data.user_id);
            localStorage.setItem("token", data.data.accessToken);
            router.push("/dashboard");
        } else {
          setIsLoading(false);
            const errorData = await response.json();
            toast({
                title: "Error",
                description: errorData.message || "Failed to login. Please try again.",
            });
        }
    } catch (error) {
      setIsLoading(false);
        toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
        });
    }
}


  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-row w-full h-full">
        {/* Left Side: Form */}
        <div className="w-full h-full flex justify-center items-center">
          {<Card className="w-[50%] p-10">
          <p className="text-3xl text-center">Welcome Back!</p>
          <p className="text-center text-primary-foreground dark:text-gray-400 my-6 text-sm">
            &quot;Effortlessly manage and visualize your logs. Your journey to a more efficient server begins here.&quot;
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input className="bg-transparent" type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            &quot;The first step towards optimizing your infrastructure is just a click away.&quot;
          </p>
          <div className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            Don&apos;t have an account?{" "}
            <Link href={'/auth/signup'}>
            <p className=" text-blue-500">Signup</p>
            </Link>
          </div>
          </Card>}
          
        </div>
        {/* Right Side: Image */}
        <div className="w-full h-full m-0 flex flex-col items-center justify-center bg-white">
  <img
    src="https://cdn.prod.website-files.com/5f16d69f1760cdba99c3ce6e/64a7da730c0e35fcb88b2713_COVER_How%20to%20Design%20a%20SaaS%20Product.png"
    alt="Log Visualization"
    width={400}
    height={400}
    className="max-w-full h-auto"
  />
 <div className=" mt-10 w-[50%] space-y-3">
 <h2 className="text-2xl font-semibold text-black">
    &quot;Empower your data insights with Logix.&quot;
  </h2>
  <p className="text-lg text-gray-600">
    Logix helps you seamlessly visualize and manage logs from all your services. Whether you&apos;re monitoring microservices or debugging server issues, Logix makes it easy to see the big picture.
  </p>
  <ul className="list-none space-y-2 text-gray-600">
    <li>✔️ Create and manage log groups effortlessly</li>
    <li>✔️ Real-time log visualization</li>
    <li>✔️ Integrated Kafka log streaming</li>
    <li>✔️ Customizable dashboards</li>
  </ul>
 </div>
</div>

      </div>
    </div>
  )
}
