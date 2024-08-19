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

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: `Passwords do not match`,
  path: ["confirmPassword"],
})

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerification, setEmailVerification] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const baseUrl = LOGIN_BASE_URL; // Assuming you have set this in your environment variables
    console.log(baseUrl);
    const signupUrl = `${baseUrl}/auth/v1/signup`;

    const ob = {
      "email": values.email,
      "password": values.password
    }

    try {
      setIsLoading(true);
        // Send the signup request to your API
        const response = await fetch(signupUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ob),
        });

        if (response.ok) {
          setIsLoading(false);
          setEmailVerification(true);
            const data = await response.json();
            toast({
                title: "Success",
                description: "Account created successfully. Please check your email to verify your account.",
            });
            // router.push("/login");
        } else {
          setIsLoading(false);
            const errorData = await response.json();
            toast({
                title: "Error",
                description: errorData.message || "Failed to sign up. Please try again.",
                variant: "destructive",
            });
        }
    } catch (error) {
      setIsLoading(false);
        toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
    }
}


  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-row w-full h-full">
        {/* Left Side: Form */}
        <div className="w-full h-full flex justify-center items-center">
          {emailVerification? <Card className="w-[50%] p-10">
            <h2 className="text-xl font-semibold text-foreground">Confirmation Email Sent!</h2>
  <p className="mt-2 text-muted-foreground text-sm">
    We&apos;ve sent a confirmation email to your inbox. Please check your email to verify your account.
  </p>
  <p className="mt-2 text-muted-foreground text-sm">
    If you don&apos;t see the email in your inbox, please check your spam or junk folder.
  </p>
          </Card> :  <Card className="w-[50%] p-10">
          <p className="text-3xl text-center">Welcome to Logix</p>
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
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            &quot;The first step towards optimizing your infrastructure is just a click away.&quot;
          </p>
          <div className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            Already have an account?{" "}
            <Link href={'/auth/login'}>
            <p className=" text-blue-500">Login</p>
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
