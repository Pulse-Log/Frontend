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
import CreateComponentSheet from "@/components/CreateComponentSheet";
import { locale } from "@/global/json-locale";
import useGlobalApi from "@/api/global-api";
import { fetchStack } from "@/api/endpoints/project";
import { useParams } from "next/navigation";

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
  
  

export default function DynamicDashboard() {
  const params = useParams();
  const{loading, data:stackData} = useGlobalApi(()=>fetchStack(params.project_id as string, params.stack_id as string), undefined, true);
  console.log(stackData);
  
  const initialData = Array.from({ length: 100 }, (_, i) => ({
    timestamp: Date.now() - (100 - i) * 1000,
    value: Math.floor(Math.random() * 1000),
  }));

  const [data, setData] = useState(initialData);
  const [graphs, setGraphs] = useState<string[]>([]);
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newTimestamp = Date.now();
  //     const newValue = Math.floor(Math.random() * 1000);
  //     handleNewData({ timestamp: newTimestamp, value: newValue });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const removeGraph = (index: number) => {
    setGraphs(graphs.filter((_, i) => i !== index));
  };

  if(!stackData){
    return null;
  }

  return (
    <div>
      <div className='w-full'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>Project {'>'} {stackData["name"]}</h1>
          <CreateComponentSheet signatureData={stackData["signatures"]}></CreateComponentSheet>
        </div>
        <p className='my-3 text-sm text-muted-foreground'>
          {stackData["description"]}
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