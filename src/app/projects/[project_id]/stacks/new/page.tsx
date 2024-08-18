"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { AlertCircle, Plus, Minus } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { createNewStack } from "@/api/endpoints/project";
import { useGlobalState } from "@/contexts/global-state-context";
import { ErrorResponse } from "@/api/global-api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation"
import { locale } from "@/global/json-locale";
import { useNavbar } from "@/contexts/navbar-context";

// Dynamically import the JSON editor to avoid SSR issues
const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  { ssr: false }
);

const signatureSchema = z.object({
  key: z
    .string()
    .min(3, {
      message: "Key must be at least 3 characters.",
    })
    .max(20, {
      message: "Key must be at most 20 characters.",
    }),
  topic: z
    .string()
    .min(1, {
      message: "Value must be at least 1 characters.",
    })
    .max(20, {
      message: "Value must be at most 20 characters.",
    }),
  schema: z.any().refine(
    (val) => {
      try {
        if (typeof val === "string") {
          JSON.parse(val);
        }
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid JSON format",
    }
  ),
});

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Project name must be at least 3 characters.",
    })
    .max(20, {
      message: "Project name must be at most 20 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Project description must be at least 10 characters.",
    })
    .max(120, {
      message: "Project description must be at most 120 characters.",
    }),
  signatures: z.array(signatureSchema).min(1, {
    message: "At least one signature is required.",
  }),
});

export default function NewStack() {
  const params = useParams();
  const projectId = params.project_id;
  const {setIsLoading} = useGlobalState();
  const router = useRouter();
  const {refetchNavbar} = useNavbar();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      signatures: [{ key: "", topic: "", schema: "{}" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "signatures",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const newStackData = {
      projectId: projectId,
      name: values.name,
      description: values.description,
      signatures: values.signatures.map((signature) => ({
        key: signature.key,
        topic: signature.topic,
        schema: signature.schema,
      })),
    };

    try {
      setIsLoading(true);
      const response = await createNewStack(newStackData);
      toast({
        title: "Success",
        description: "New Stack created successfully"
      });
      refetchNavbar();
      router.push(`/projects/${projectId}`);
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

  return (
    <div className="flex flex-col justify-start items-center gap-10">
      <div className="flex justify-center items-start h-full flex-col gap-8 w-[50%]">
        <h1 className="text-3xl font-semibold">Create new Project</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-2 my-5 text-sm text-zinc-500">
              <li>
                Choose a unique and descriptive project name for easy
                identification.
              </li>
              <li>You can add multiple signatures for your project.</li>
              <li>
                Use the JSON editor for the schema field to ensure valid JSON.
              </li>
              <li>You can modify project settings later if needed.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
      <div className="h-fit border rounded-lg flex items-center justify-center w-[50%] bg-black py-[5%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[50%] h-fit flex flex-col gap-7"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stack Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of the project" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the stack.
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
                    <Input
                      placeholder="Description of the project"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the description of the stack.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h1 className="my-2 font-bold text-xl">SIGNATURES</h1>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <FormField
                  control={form.control}
                  name={`signatures.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`signatures.${index}.topic`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Schema (JSON)</FormLabel>
                  <FormControl>
                    <Controller
                      name={`signatures.${index}.schema`}
                      control={form.control}
                      render={({ field }) => (
                        <JSONEditor
                          placeholder={{
                            example: "Enter your JSON schema here",
                          }}
                          locale={locale}
                          colors={{
                            background: "transparent",
                            default: "#D4D4D4",
                            string: "#CE9178",
                            number: "#B5CEA8",
                            colon: "#49B8F7",
                            keys: "#9CDCFE",
                            // error: "#F44336",
                          }}
                          style={{ body: { fontSize: "12px" } }}
                          height="200px"
                          width="100%"
                          onBlur={(value: { json: string }) =>
                            field.onChange(value.json)
                          }
                          // value={field.value}
                        />
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Edit your JSON schema here. The editor will help with
                    formatting and validation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={index === 0 && fields.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ key: "", topic: "", schema: "{}" })}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Signature
            </Button>
            <Button className="my-8" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
