"use client"

import { fetchProjectSettings, updateProject } from '@/api/endpoints/project';
import useGlobalApi, { ErrorResponse } from '@/api/global-api';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from '@/contexts/global-state-context';
import { useNavbar } from '@/contexts/navbar-context';
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  projectName: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }).max(50, {
    message: "Project name must be at most 50 characters."
  }),
  description: z.string().max(500, {
    message: "Description must be at most 500 characters."
  }).optional(),
  // connectionUrl: z.string().url({
  //   message: "Please enter a valid URL.",
  // }),
  connectionTimeout: z.number().min(1).max(60),
  logFormat: z.enum(["json"]),
  numberOfLogs: z.number().min(200, "Number of logs should be minimum 200.").max(1000, "Number of logs should be maximum of 1000."),
  userRole: z.enum(["admin", "editor", "viewer"]),
  inviteEmail: z.string().email({
    message: "Please enter a valid email address.",
  }).optional(),
  debugMode: z.boolean(),
  broker: z.string().url({
    message: "Please enter a valid URL.",
  }),
  username: z.string().min(1,{
    message: "Please enter a valid username."
  }),
  password: z.string().min(1,{
    message: "Please enter a valid password."
  })
});

const ProjectSettingsPage = () => {
  const params = useParams();
  const router = useRouter();
  const {refetchNavbar} = useNavbar();
  const {setIsLoading} = useGlobalState();
  const { loading, data } = useGlobalApi(
    () => fetchProjectSettings(params.project_id as string),
    undefined,
    true
  );

  console.log(data);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: data? data.name : "hello",
      description: data?.description || "",
      connectionTimeout: data?.source?.configuration?.timeout || 30,
      logFormat: "json",
      numberOfLogs: 200,
      userRole: "viewer",
      debugMode: false
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        projectName: data.project.name || "",
        description: data.project.description || "",
        connectionTimeout: data.connectionTimeout || 30,
        logFormat: "json",
        numberOfLogs: data.numberOfLogs || 200,
        userRole: "viewer",
        broker: data.project.source.configuration?.broker || "",
        username: data.project.source.configuration?.username || "",
        password: data.project.source.configuration?.password || "",
        debugMode: data.project.source.debugMode || false
      });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const updateSettings = {
        name: values.projectName,
          description: values.description,
          source: {
            debugMode: values.debugMode,
            configuration: data.project.source.interface.name === "Kafka"? {
              broker: values.broker,
              username: values.username,
              password: values.password
            }:null
          },
          settings:{
            numberOfLogs: values.numberOfLogs,
        connectionTimeout: values.connectionTimeout,
          },
      }
      await updateProject(params.project_id as string, updateSettings);
      toast({
        title: "Success",
        description: "Project settings updated successfully"
      });
      refetchNavbar();
      router.push(`/projects/${params.project_id}`);
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data as ErrorResponse;
        errorMessage = errorResponse.data.message || errorResponse.data.statusCode.toString();
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (loading || !data) return;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Project Settings</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>The name of your project.</FormDescription>
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
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>A brief description of your project.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="logSource"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Log Source</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select log source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    <SelectItem value="kafka">Kafka</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The source of your logs.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div>
          <p>Interface</p>
          <p>{data.project.source.interface.name}</p>
          </div>

{
            data.project.source.interface.name === "Kafka"? (
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

          <FormField
            control={form.control}
            name="connectionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection Timeout (seconds)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormDescription>Timeout for the connection in seconds.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Log Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select log format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The format of your logs.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfLogs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Logs Range</FormLabel>
                <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormDescription>Maximum number of logs to show in viewers.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The role for new users.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inviteEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite User</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input {...field} placeholder="Enter email address" className="flex-grow" />
                    <Button type="button" onClick={() => {
                      // Implement invite logic here
                      toast({
                        title: "Invite Sent",
                        description: `Invitation sent to ${field.value}`
                      });
                      field.onChange("");
                    }}>Invite</Button>
                  </div>
                </FormControl>
                <FormDescription>Invite a new user to the project.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="debugMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Debug Mode</FormLabel>
                  <FormDescription>
                    Enable debug mode for additional logging.
                  </FormDescription>
                </div>
                <FormControl>
                   <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  /> 
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Save Settings</Button>
        </form>
      </Form>

      <div className="mt-8">
        <Button variant="destructive" onClick={() => {
          // Implement delete project logic here
          if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            toast({
              title: "Project Deleted",
              description: "The project has been successfully deleted."
            });
            router.push("/dashboard");
          }
        }}>Delete Project</Button>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;