"use client";

import { deleteStack, editStack, fetchProject } from "@/api/endpoints/project";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useGlobalState } from "@/contexts/global-state-context";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { useNavbar } from "@/contexts/navbar-context";

const formSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(10).max(120),
  sId: z.string()
});

function StackDialog({ stack, projectId, onSuccess }:any) {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsLoading } = useGlobalState();
  const {refetchNavbar} = useNavbar();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sId: stack.sId,
      name: stack.name,
      description: stack.description
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        sId: stack.sId,
        name: stack.name,
        description: stack.description
      });
    }
  }, [isOpen, stack, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const updateStack = {
        name: values.name,
        description: values.description,
      }
      await editStack(projectId, values.sId, updateStack);
      toast({
        title: "Success",
        description: "Stack updated successfully"
      });
      setIsOpen(false);
      refetchNavbar();
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

  async function deleteSt () {
    try {
      setIsLoading(true);
      await deleteStack(projectId, stack.sId);
      toast({
        title: "Success",
        description: "Stack deleted successfully"
      });
      setIsOpen(false);
      refetchNavbar();
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
          <DialogTitle>Settings for {stack.name}</DialogTitle>
          <DialogDescription>
            Make changes to your stack. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%] h-fit flex flex-col gap-7">
              <FormField
                control={form.control}
                name="sId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stack Id</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormDescription>Stack Id.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stack Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name of the stack" />
                    </FormControl>
                    <FormDescription>Edit the name of the stack.</FormDescription>
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
                      <Input {...field} placeholder="Description of the stack" />
                    </FormControl>
                    <FormDescription>Edit the description of the stack.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className=" flex justify-end items-center gap-3">
                
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
          <Button variant={'destructive'} onClick={deleteSt}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectHome() {
  const params = useParams();
  const route = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const fetchProjectData = useCallback(() => fetchProject(params.project_id as string), [params.project_id]);
  
  const { loading, data, fetchData: refetch } = useGlobalApi(fetchProjectData, [], true);
  const { status, joinProject, infoLogs, editInterface, stackStatus, lpsUpdate } =
    useSocketState();

  useEffect(() => {
    joinProject({
      userId: localStorage.getItem("userId")!,
      projectId: params.project_id as string,
    });
  }, [joinProject, params.project_id]);
  console.log(data);

  function onNavigate(to: string) {
    route.push(to);
  }

  function pause() {
    editInterface({
      userId: localStorage.getItem("userId")!,
      projectId: params.project_id as string,
      status: "pause",
    });
  }

  function restart() {
    editInterface({
      userId: localStorage.getItem("userId")!,
      projectId: params.project_id as string,
      status: "restart",
    });
  }

  const logContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   name: "",
    //   description: ""
    // },
  });

  function getHoursSince(timestamp: string): number {
    const createdDate = new Date(timestamp);
    const now = new Date();
  
    // Calculate the difference in hours
    const diffInMilliseconds = now.getTime() - createdDate.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  }

  function formatDate(timestamp: string): string {
    const createdDate = new Date(timestamp);
  
    // Format the date (31 July 2024)
    const day = createdDate.getDate();
    const month = createdDate.toLocaleString('default', { month: 'long' });
    const year = createdDate.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  

  useEffect(() => {
    const logContainer = logContainerRef.current;
    if (logContainer) {
      const isScrolledToBottom =
        logContainer.scrollHeight - logContainer.clientHeight <=
        logContainer.scrollTop + 1;

      if (isScrolledToBottom) {
        shouldScrollRef.current = true;
      }

      if (shouldScrollRef.current) {
        logContainer.scrollTop =
          logContainer.scrollHeight - logContainer.clientHeight;
      }
    }
  }, [infoLogs]);

  const handleScroll = () => {
    const logContainer = logContainerRef.current;
    if (logContainer) {
      const isScrolledToBottom =
        logContainer.scrollHeight - logContainer.clientHeight <=
        logContainer.scrollTop + 1;
      shouldScrollRef.current = isScrolledToBottom;
    }
  };

  if (!data) return null;
  return (
    <div>
      <div className=" w-full">
        <div className="flex justify-start items-center gap-3">
          <h1 className="text-3xl">{data["name"]}</h1>
          {status === "Offline" ? (
            <p className=" bg-red-500 rounded-lg px-2 py-1 text-sm">Offline</p>
          ) : (
            <>
              <p className=" bg-green-500 rounded-lg px-2 py-1 text-sm">
                Online
              </p>
              <FaPause className=" cursor-pointer" onClick={pause} />
            </>
          )}
          <MdOutlineRefresh
            className=" cursor-pointer text-xl"
            onClick={restart}
          />
        </div>
        <p className=" my-5 text-sm text-muted-foreground">
          {data["description"]}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {/* <div className=' flex w-full h-full border border-white/[.2] rounded-2xl'>

          </div> */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Stacks</h3>
            <PiStackSimpleFill className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">
              {data["stacks"].length} stacks
            </div>
            <p className="text-xs text-muted-foreground">
              total in {data["name"]}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Duration</h3>
            <FaClock className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">{getHoursSince(data["createdAt"])} hours</div>
            <p className="text-xs text-muted-foreground">
              since {formatDate(data["createdAt"])}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">LPS</h3>
            <IoAnalytics className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">{(() => {
          let totalLPS = 0;
          if(lpsUpdate===null || status==="Offline"){
            return 0;
          }
          const valuesArray = Array.from(lpsUpdate.values());
          for (let i = 0; i < valuesArray.length; i++) {
            totalLPS += valuesArray[i];
          }
          return totalLPS;
        })()}</div>
            <p className="text-xs text-muted-foreground">Logs per second</p>
          </div>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-8">
        <div>
          <div className=" flex justify-between w-full items-center">
            <h1 className=" font-semibold text-base">Stacks</h1>
            <Link href={`/projects/${params.project_id}/stacks/new`}>
              <p className=" h-fit cursor-pointer px-4 my-1 py-2 bg-white text-black flex justify-center align-middle rounded-lg text-base">
                New stack
              </p>
            </Link>
          </div>
          <div className="max-w-full">
            <Table>
              <TableCaption>A list of your stacks.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Settings</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead className="text-right">LPS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className=" overflow-auto">
                {data["stacks"].map((stack: any, index: number) => (
                  // <Link href={`/projects/${params.project_id}/stacks/${stack.sId}`} className="w-full">

                  // </Link>
                  <TableRow
                    key={stack["sId"]}                    
                  >
                    <TableCell className="font-medium">
                      {stack["name"]}
                    </TableCell>
                    <TableCell>{stack["description"]}</TableCell>
                    {status==="Offline"? <TableCell className=" text-red-500">Halted</TableCell> : stackStatus ? (
                      stackStatus.has(stack["sId"]) ? (
                        stackStatus.get(stack["sId"])!.get("Running")!.size >
                          0 &&
                        stackStatus.get(stack["sId"])?.get("Stopped")?.size ==
                          0 ? (
                          <TableCell className=" text-green-500">Active</TableCell>
                        ) : stackStatus.get(stack["sId"])!.get("Running")!
                            .size == 0 &&
                          stackStatus.get(stack["sId"])!.get("Stopped")!.size >
                            0 ? (
                          <TableCell className=" text-red-500">Halted</TableCell>
                        ) : (
                          <TableCell className=" text-yellow-500">Partial</TableCell>
                        )
                      ) : (
                        <TableCell className=" text-red-500">Halted</TableCell>
                      )
                    ) : (
                      <TableCell className=" text-red-500">Halted</TableCell>
                    )}
                    {/* <TableCell>{stackStatus? }</TableCell> */}
                    <TableCell>
                    <StackDialog stack={stack} projectId={params.project_id as string} onSuccess={refetch}></StackDialog>
                    </TableCell>
                    <TableCell><Button variant='default' onClick={() =>
                      onNavigate(
                        `/projects/${params.project_id}/stacks/${stack.sId}`
                      )
                    }>View</Button></TableCell>
                    <TableCell className="text-right">{(() => {
          let totalLPS = 0;
          if(lpsUpdate===null || status==="Offline"){
            return 0;
          }
          // const valuesArray = Array.from(lpsUpdate.entries());
          for (let sig of stack.signatures) {
            if(lpsUpdate.has(sig.topic)){
              totalLPS+=lpsUpdate.get(sig.topic)!;
            }
          }
          return totalLPS;
        })()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <h1 className=" font-semibold text-base">Project Logs</h1>
          <div
            ref={logContainerRef}
            onScroll={handleScroll}
            className=" max-w-full h-[50vh] border bg-[#000000] my-5 rounded-lg overflow-y-auto p-5"
          >
            {infoLogs.map((log, index) => (
              <div key={index + log} className="mb-1">
                {/* <span className="text-muted-foreground">[{formatTimestamp(log.timestamp)}]</span> */}
                <p
                  key={index + log}
                  className=" text-muted-foreground tracking-wide leading-relaxed text-sm"
                >
                  {log}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
