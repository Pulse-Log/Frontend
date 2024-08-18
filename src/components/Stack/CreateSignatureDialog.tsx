"use client";

import { createSignature } from "@/api/endpoints/project";
import { ErrorResponse } from "@/api/global-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/contexts/global-state-context";
import { locale } from "@/global/json-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  { ssr: false }
);

const formSchema = z.object({
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
  
export function NewSignatureDialog({ onSuccess }:any) {
    const [isOpen, setIsOpen] = useState(false);
    const { setIsLoading } = useGlobalState();
    const params = useParams();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    //   defaultValues: {
    //     signatureId: signature.signatureId,
    //     key: signature.key,
    //     topic: signature.topic,
    //     schema: JSON.parse(signature.schema)
    //   }
    });
  
    useEffect(() => {
      if (isOpen) {
        form.reset();
      }
    }, [isOpen, form]);
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        setIsLoading(true);
        const createSignatur = {
          key: values.key,
          topic: values.topic,
          schema: values.schema,
          sId: params.stack_id as string
        }
        await createSignature(createSignatur);
        toast({
          title: "Success",
          description: "Signature created successfully"
        });
        setIsOpen(false);
        onSuccess();
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
        setIsOpen(false);
        setIsLoading(false);
      }
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">New Signature</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="pt-2">
            <DialogTitle>New Signature</DialogTitle>
            <DialogDescription>
              Create new signature. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%] h-fit flex flex-col gap-7">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Key of the signature" />
                      </FormControl>
                      <FormDescription>Enter the key of the signature</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Topic of the signature" />
                      </FormControl>
                      <FormDescription>Enter the topic of the signature.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormItem>
                  <FormLabel>Schema (JSON)</FormLabel>
                  <FormControl>
                    <Controller
                      name={`schema`}
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
                    Enter your JSON schema here. The editor will help with
                    formatting and validation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                <DialogFooter className=" flex justify-end items-center gap-3">
                  
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }