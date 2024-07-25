"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { GraphComponent } from "@/components/LineGraph";
import { Button } from "@/components/ui/button"
import { CardHeader, CardContent } from "@/components/ui/card"
import { Card, CardTitle } from "@/components/ui/card-hover-effect"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import ContainerLoading from "@/components/ContainerLoading";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  { ssr: false }
);

// Sample topics and their schemas
const sampleTopics = [
  {
    name: "logs",
    schema: {
      type: "object",
      properties: {
        timestamp: { type: "number" },
        level: { type: "string" },
        message: { type: "string" }
      }
    }
  },
  {
    name: "metrics",
    schema: {
      type: "object",
      properties: {
        timestamp: { type: "number" },
        cpu: { type: "number" },
        memory: { type: "number" }
      }
    }
  }
];

const locale = {
    format: "{reason} at line {line}",
    symbols: {
      colon: ":",
      comma: ",",
      semicolon: ";",
      slash: "/",
      backslash: "\\",
      brackets: {
        round: "( )",
        square: "[ ]",
        curly: "{ }",
        angle: "< >"
      },
      period: ".",
      quotes: {
        single: "' '",
        double: "\" \"",
        grave: "` `"
      },
      space: " ",
      ampersand: "&",
      asterisk: "*",
      at: "@",
      equals: "=",
      hash: "#",
      percent: "%",
      plus: "+",
      minus: "-",
      dash: "-",
      hyphen: "-",
      tilde: "~",
      underscore: "_",
      bar: "|"
    },
    types: {
      key: "key",
      value: "value",
      number: "number",
      string: "string",
      primitive: "primitive",
      boolean: "boolean",
      character: "character",
      integer: "integer",
      array: "array",
      float: "float"
    },
    invalidToken: {
      tokenSequence: {
        prohibited: "'{firstToken}' token cannot be followed by '{secondToken}' token(s)",
        permitted: "'{firstToken}' token can only be followed by '{secondToken}' token(s)"
      },
      termSequence: {
        prohibited: "A {firstTerm} cannot be followed by a {secondTerm}",
        permitted: "A {firstTerm} can only be followed by a {secondTerm}"
      },
      double: "'{token}' token cannot be followed by another '{token}' token",
      useInstead: "'{badToken}' token is not accepted. Use '{goodToken}' instead",
      unexpected: "Unexpected '{token}' token found"
    },
    brace: {
      curly: {
        missingOpen: "Missing '{' open curly brace",
        missingClose: "Open '{' curly brace is missing closing '}' curly brace",
        cannotWrap: "'{token}' token cannot be wrapped in '{}' curly braces"
      },
      square: {
        missingOpen: "Missing '[' open square brace",
        missingClose: "Open '[' square brace is missing closing ']' square brace",
        cannotWrap: "'{token}' token cannot be wrapped in '[]' square braces"
      }
    },
    string: {
      missingOpen: "Missing/invalid opening string '{quote}' token",
      missingClose: "Missing/invalid closing string '{quote}' token",
      mustBeWrappedByQuotes: "Strings must be wrapped by quotes",
      nonAlphanumeric: "Non-alphanumeric token '{token}' is not allowed outside string notation",
      unexpectedKey: "Unexpected key found at string position"
    },
    key: {
      numberAndLetterMissingQuotes: "Key beginning with number and containing letters must be wrapped by quotes",
      spaceMissingQuotes: "Key containing space must be wrapped by quotes",
      unexpectedString: "Unexpected string found at key position"
    },
    noTrailingOrLeadingComma: "Trailing or leading commas in arrays and objects are not permitted"
  };
  
  const formSchema = z.object({
    dataPath: z.string().min(3, {
      message: "DataPath must be at least 3 characters.",
    }),
    component: z
    .string({
      required_error: "Select a component.",
    }),
  })

export default function DynamicDashboard() {
  const initialData = Array.from({ length: 100 }, (_, i) => ({
    timestamp: Date.now() - (100 - i) * 1000,
    value: Math.floor(Math.random() * 1000),
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataPath: "",
      component: ""
    },
  })  
  const component = form.watch("component");

  const [data, setData] = useState(initialData);
  const [graphs, setGraphs] = useState<string[]>([]);
  const [newGraphCondition, setNewGraphCondition] = useState("");
  const [topics, setTopics] = useState(sampleTopics);

  const handleNewData = (newDataPoint: any) => {
    setData((prevData) => {
      let updatedData = [...prevData, newDataPoint];
      if (updatedData.length > 500) {
        updatedData = updatedData.slice(-500);
      }
      return updatedData;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimestamp = Date.now();
      const newValue = Math.floor(Math.random() * 1000);
      handleNewData({ timestamp: newTimestamp, value: newValue });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const removeGraph = (index: number) => {
    setGraphs(graphs.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setGraphs([...graphs, values["dataPath"]]);
    // const projectData: any = {
    //   "name": values["projectname"],
    //   "description": values["description"],
    //   "source": {
    //     "interface": values["projectInterface"],
    //     "configuration": values["projectInterface"] === "Kafka" ? {
    //       "username": values["username"],
    //       "password": values["password"],
    //       "broker": values["broker"]
    //     }: null
    //   }
    // }
    // try {
    //   setIsLoading(true);
    //   const response = await createNewProject(projectData);
    //   toast({
    //     title: "Success",
    //     description: "Project created successfully"
    //   });
    //   router.push("/dashboard");
    // } catch (error) {
    //   let errorMessage = 'An unknown error occurred';
    //   if (error instanceof AxiosError && error.response) {
    //     const errorResponse = error.response.data as ErrorResponse;
    //     errorMessage = errorResponse.data.message || errorResponse.data.statusCode.toString();
    //   } else if (error instanceof Error) {
    //     errorMessage = error.message;
    //   }

    //   toast({
    //     title: "Error",
    //     description: errorMessage
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <div className='fixed left-[15vw] bottom-0 top-0 right-0 p-10 overflow-y-auto'>
      <div className='w-full'>
        <div className='flex justify-between items-center gap-3'>
          <h1 className='text-2xl font-semibold'>Stack Analytics Dashboard</h1>
          <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Create new Viewer</Button>
      </SheetTrigger>
      <SheetContent className=" w-[30vw] overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Viewer</SheetTitle>
          <SheetDescription>
          To create a viewer, you need to specify the Data Path. The Data Path is the location within your JSON logs where the data for the graph is found. It follows the structure of your JSON logs and uses dot notation to navigate through nested objects.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
            <h1 className=" text-base font-semibold">Example</h1>
            <JSONEditor
                    //   id={`jsoneditor`}
                      placeholder={{
                        "metrics": {
                          "performance": {
                            "responseTime": 120,
                            "throughput": 75
                          },
                          "timestamp": "2024-07-24T14:30:00Z"
                        }
                      }}
                      locale={locale}
                      viewOnly={true}
                      theme="light_mitsuketa_tribute"
                      colors={{
                        default: "#000000",
                        background: "#FFFFFF",
                        string: "#00FF00",
                        number: "#FF0000",
                        colon: "#000000",
                        keys: "#0000FF"
                      }}
                      height="200px"
                      width="100%"
                    />
                    <p>To create a viewer that visualizes the responseTime within performance, you would input: <b>metrics.performance.responseTime</b></p>
          </div><div className=" flex flex-col items-center">
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full h-fit flex flex-col gap-7" >
        <FormField
          control={form.control}
          name="dataPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="data.metadata.latency" {...field} />
              </FormControl>
              <FormDescription>
                Enter the datapath of the viewer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="component"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Component</FormLabel>
              {<FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a component." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.map((inter: any, index:number)=>(
                    <SelectItem  key={inter["interfaceId"]} value={inter["name"]}>{inter["name"]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </FormControl>}
              <FormDescription>
              Choose a component block you wanted to add in the stack.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="my-8" type="submit">Submit</Button>
      </form>
    </Form>
          </div>
      </SheetContent>
    </Sheet>
        </div>
        <p className='my-5 text-base text-zinc-400'>
          This dashboard provides real-time analytics for your stack. Add custom graphs based on incoming data and explore subscribed topics.
        </p>
      </div>

      <Card className="mb-4 h-fit">
        <CardHeader>
          <CardTitle>Subscribed Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {topics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{topic.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">JSON Schema:</h4>
                    <JSONEditor
                      id={`jsoneditor-${index}`}
                      placeholder={topic.schema}
                      locale={locale}
                      viewOnly={true}
                      theme="light_mitsuketa_tribute"
                      colors={{
                        default: "#000000",
                        background: "#FFFFFF",
                        string: "#00FF00",
                        number: "#FF0000",
                        colon: "#000000",
                        keys: "#0000FF"
                      }}
                    //   height="200px"
                      width="100%"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      

      <Card className="mb-4 h-fit">
        <CardHeader>
          <CardTitle>Add New Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter data condition (e.g., data.logs.latency)"
              value={newGraphCondition}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGraphCondition(e.target.value)}
            />
            <Button onClick={addGraph}>Add Graph</Button>
          </div>
        </CardContent>
      </Card>

      {graphs.map((condition, index) => (
        <GraphComponent
          key={index}
          data={data}
          condition={condition}
          onRemove={() => removeGraph(index)}
        />
      ))}
    </div>
  );
}