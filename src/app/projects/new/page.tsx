"use client"

import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { AlertCircle, Link } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  projectname: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }).max(20, {
    message: "Project name must be atmost 20 characters."
  }),
  description: z.string().min(10, {
    message: "Project description must be at least 10 characters.",
  }).max(120, {
    message: "Project description must be atmost 120 characters."
  }),
  projectInterface: z
  .string({
    required_error: "Select an interface.",
  }),
  broker: z.string().url({
    message: "Please enter a valid URL.",
  }),
  username: z.string().min(1,{
    message: "Please enter a valid username."
  }),
  password: z.string().min(1,{
    message: "Please enter a valid password."
  })
})

export default function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectname: "",
      projectInterface: ""
    },
  })

  const projectInterface = form.watch("projectInterface");

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className=' fixed left-[17vw] bottom-0 top-0 right-0 p-10 overflow-y-auto flex flex-col justify-start items-center gap-10 '>
        <div className=" flex justify-center items-start h-full flex-col gap-8 w-[50%]">
        <h1 className=" text-3xl font-semibold">Create new Project</h1>
        <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5 space-y-2 my-5 text-sm text-zinc-500">
            <li>Choose a unique and descriptive project name for easy identification.</li>
            <li>Select the appropriate interface (Kafka, RabbitMQ, etc.) for your log source.</li>
            <li>Additional fields will appear based on your selected interface.</li>
            <li>Ensure all required fields are filled out accurately.</li>
            <li>You can modify project settings later if needed.</li>
          </ul>
        </AlertDescription>
      </Alert>
        </div>
        <div className=" h-fit border rounded-lg flex items-center justify-center w-[50%] bg-black py-[5%]">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" w-[50%] h-fit flex flex-col gap-7" >
        <FormField
          control={form.control}
          name="projectname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the project" {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description of the project" {...field} />
              </FormControl>
              <FormDescription>
                Enter the description of the project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectInterface"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interface</FormLabel>
              <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interface." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Kafka">Kafka</SelectItem>
                </SelectContent>
              </Select>
              </FormControl>
              <FormDescription>
              Choose an interface of the project. Interface is the type of centralized logging interface you have.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {
            projectInterface === "Kafka"? (
            <>
            <FormField
          control={form.control}
          name="broker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker URL</FormLabel>
              <FormControl>
                <Input placeholder="Broker of the logs" {...field} />
              </FormControl>
              <FormDescription>
                Enter the broker of the kafka.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kafka consumer username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                Enter the username of the consumer of kafka.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kafka consumer password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                Enter the password of the consumer of kafka.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            </>
            ):null
        }
        <Button className="my-8" type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}