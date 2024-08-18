"use client";

import { deleteSignature, deleteStack, editSignature, editStack, fetchProject } from "@/api/endpoints/project";
import useGlobalApi, { ErrorResponse } from "@/api/global-api";
import { Card } from "@/components/ui/card";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { FaClock, FaPause } from "react-icons/fa";
import { IoAnalytics } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { PiStackSimpleFill } from "react-icons/pi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSocketState } from "@/contexts/web-socket-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useGlobalState } from "@/contexts/global-state-context";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { locale } from "@/global/json-locale";
import dynamic from "next/dynamic";

const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  { ssr: false }
);

const formSchema = z.object({
  signatureId: z.string(),
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
  
export function SignatureDialog({ signature, onSuccess, canDelete }:any) {
    const [isOpen, setIsOpen] = useState(false);
    const { setIsLoading } = useGlobalState();
    const params = useParams();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        signatureId: signature.signatureId,
        key: signature.key,
        topic: signature.topic,
        schema: JSON.parse(signature.schema)
      }
    });
  
    useEffect(() => {
      if (isOpen) {
        form.reset({
          signatureId: signature.signatureId,
        key: signature.key,
        topic: signature.topic,
        schema: JSON.parse(signature.schema)
        });
      }
    }, [isOpen, signature, form]);
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        setIsLoading(true);
        const updateSignature = {
          key: values.key,
          topic: values.topic,
          schema: values.schema
        }
        await editSignature(params.project_Id as string, params.stack_id as string, signature.signatureId, updateSignature);
        toast({
          title: "Success",
          description: "Signature updated successfully"
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
  
    async function deleteSig () {
      try {
        setIsLoading(true);
        await deleteSignature(params.project_id as string, params.stack_id as string, signature.signatureId);
        toast({
          title: "Success",
          description: "Signature deleted successfully"
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
          <Button variant="outline">Settings</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="pt-2">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Make changes to your signature. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%] h-fit flex flex-col gap-7">
                <FormField
                  control={form.control}
                  name="signatureId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature Id</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormDescription>Signature Id.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Key of the signature" />
                      </FormControl>
                      <FormDescription>Edit the key of the signature</FormDescription>
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
                      <FormDescription>Edit the topic of the signature.</FormDescription>
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
                    Edit your JSON schema here. The editor will help with
                    formatting and validation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                <DialogFooter className=" flex justify-end items-center gap-3">
                  
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
            {canDelete? <Button variant={'destructive'} onClick={deleteSig}>Delete</Button> : null}
          </div>
        </DialogContent>
      </Dialog>
    );
  }