import React, { use, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Input } from "./ui/input";
import dynamic from "next/dynamic";
import { locale } from "@/global/json-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useGlobalApi, { ErrorResponse } from "@/api/global-api";
import { createNewComponent, fetchViewers } from "@/api/endpoints/project";
import ContainerLoading from "./ContainerLoading";
import { useParams, useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';
import { useGlobalState } from '@/contexts/global-state-context';
import { AxiosError } from 'axios';

const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  { ssr: false }
);

// Define types for our data structures
interface Signature {
  signatureId: string;
  topic: string;
  key: string;
  sId: string;
  schema: Record<string, unknown>;
}

interface Viewer {
  viewerId: string;
  name: string;
}

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  dataPath: z.string().min(3, {
    message: "DataPath must be at least 3 characters.",
  }),
  viewer: z.string({
    required_error: "Select a viewer",
  }),
  signature: z.string({
    required_error: "Select a signature"
  })
});

// Infer the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define props for our component
interface CreateComponentSheetProps {
  signatureData: Signature[];
}

export default function CreateComponentSheet({ signatureData }: CreateComponentSheetProps) {
  const { loading, data: viewers } = useGlobalApi<Viewer[]>(
    fetchViewers,
    [undefined],
    false
  );

  const params = useParams();
  const router = useRouter();
  const {setIsLoading} = useGlobalState();
  
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataPath: "",
      viewer: "",
      signature: "",
    },
  });

  const viewer = form.watch("viewer");
  const signature = form.watch("signature");

  const handleSignatureChange = (value: string) => {
    form.setValue("signature", value);
    const selected = signatureData.find(sig => sig.signatureId === value);
    setSelectedSignature(selected || null);
  };

  const getSignatureDetails = () => {
    if (!selectedSignature) return null;
    return {
      topic: selectedSignature.topic,
      key: selectedSignature.key,
      schema: selectedSignature.schema
    };
  };

  async function onSubmit(values: FormValues) {
    console.log(values);
    // Implement your submit logic here
    const ob = {
        "name": values.name,
        "description": values.description,
        "dataPath": values.dataPath,
        "signatureId": values.signature,
        "viewerId": values.viewer,
        "sId": params.stack_id
    };
    try {
        setIsLoading(true);
        const response = await createNewComponent(ob);
        toast({
          title: "Success",
          description: "New Component created successfully"
        });
        router.push(`/projects/${params.project_id}/stacks/${params.stack_id}`);
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
        setIsOpen(false);
      }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Create new Viewer</Button>
      </SheetTrigger>
      <SheetContent className="w-[30vw] overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Viewer</SheetTitle>
          <SheetDescription>
            To create a viewer, specify the Data Path and select a signature.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of component" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of component.
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
                      <Input placeholder="Enter the description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the description of the component.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Path</FormLabel>
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
                name="viewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viewer</FormLabel>
                    {loading ? (
                      <ContainerLoading />
                    ) : (
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a viewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {viewers.map((viewer:any) => (
                              <SelectItem key={viewer.viewerId} value={viewer.viewerId}>
                                {viewer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    )}
                    <FormDescription>
                      Choose a viewer block you want to add to the stack.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleSignatureChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a signature" />
                        </SelectTrigger>
                        <SelectContent>
                          {signatureData.map((sig) => (
                            <SelectItem key={sig.signatureId} value={sig.signatureId}>
                              Topic: {sig.topic}, Key: {sig.key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose a signature to which your dataPath belongs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedSignature && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Signature Details</h3>
                  <JSONEditor
                    placeholder={getSignatureDetails()}
                    locale={locale}
                    viewOnly={true}
                    theme="light_mitsuketa_tribute"
                    colors={{
                      default: "#000000",
                      background: "#FFFFFF",
                      string: "#00FF00",
                      number: "#FF0000",
                      colon: "#000000",
                      keys: "#0000FF",
                    }}
                    height="200px"
                    width="100%"
                  />
                </div>
              )}
              <Button className="mt-4" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}