"use client";
import { deleteComponent, fetchStack } from "@/api/endpoints/project";
import useGlobalApi, { ErrorResponse } from "@/api/global-api";
import CreateComponentSheet from "@/components/CreateComponentSheet";
import { GraphComponent } from "@/components/LineGraph";
import { NewSignatureDialog } from "@/components/Stack/CreateSignatureDialog";
import { SignatureDialog } from "@/components/Stack/EditSignatureDialog";
import { Terminal } from "@/components/Terminal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/contexts/global-state-context";
import { useSocketState } from "@/contexts/web-socket-context";
import { locale } from "@/global/json-locale";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { IoAnalytics } from "react-icons/io5";
import { PiStackSimpleFill } from "react-icons/pi";

const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  { ssr: false }
);

export default function DynamicDashboard() {
  const params = useParams();
  const { setIsLoading } = useGlobalState();

  const fetchStackData = useCallback(
    () => fetchStack(params.project_id as string, params.stack_id as string),
    [params.stack_id, params.project_id]
  );

  const {
    loading,
    data: stackData,
    fetchData: refetch,
  } = useGlobalApi(fetchStackData, undefined, true);

  // console.log(stackData);
  const { joinStack, leaveStack, stackStatus, status, lpsUpdate, joinProject } =
    useSocketState();
  const [signatureView, setSignatureView] = useState("");

  useEffect(() => {
    joinProject({
      userId: localStorage.getItem("userId")!,
      projectId: params.project_id as string,
    });
    joinStack({
      projectId: params.project_id as string,
      sId: params.stack_id as string,
      userId: localStorage.getItem("userId") as string,
    });
    return () => {
      leaveStack();
    };
  }, [joinStack, leaveStack, params.project_id, params.stack_id, joinProject]);

  async function deleteCompo(signatureId: string, componentId: string) {
    try {
      setIsLoading(true);
      await deleteComponent(
        params.project_id as string,
        params.stack_id as string,
        signatureId,
        componentId
      );
      toast({
        title: "Success",
        description: "Signature created successfully",
      });
      await refetch();
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data as ErrorResponse;
        errorMessage =
          errorResponse.data.message ||
          errorResponse.data.statusCode.toString();
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!stackData) {
    return null;
  }

  console.log(stackData);

  return (
    <div className=" flex flex-col gap-8">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">
            {stackData["project"]["name"]} {">"} {stackData["name"]}
          </h1>
        </div>
        <p className="my-3 text-sm text-muted-foreground">
          {stackData["description"]}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* <div className=' flex w-full h-full border border-white/[.2] rounded-2xl'>

          </div> */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Viewers
            </h3>
            <PiStackSimpleFill className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">
              {stackData.components.length} viewers
            </div>
            <p className="text-xs text-muted-foreground">
              total in {stackData.name}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Signatures
            </h3>
            <PiStackSimpleFill className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">
              {stackData.signatures.length} signatures
            </div>
            <p className="text-xs text-muted-foreground">
              total in {stackData.name}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">LPS</h3>
            <IoAnalytics className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">
              {(() => {
                let totalLPS = 0;
                if (lpsUpdate === null || status === "Offline") {
                  return 0;
                }
                // const valuesArray = Array.from(lpsUpdate.entries());
                for (let sig of stackData.signatures) {
                  if (lpsUpdate.has(sig.topic)) {
                    totalLPS += lpsUpdate.get(sig.topic)!;
                  }
                }
                return totalLPS;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">Logs per second</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Create new Viewer
            </h3>
            <FaClock className=" text-muted-foreground" />
          </div>
          <div className="p-8 pt-0">
            <CreateComponentSheet
              signatureData={stackData["signatures"]}
            ></CreateComponentSheet>
          </div>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-[500px]">
        <div className=" h-[500px]">
          <div className=" flex justify-between w-full items-center">
            <h1 className=" font-semibold text-base">Signatures</h1>
            <NewSignatureDialog onSuccess={refetch}></NewSignatureDialog>
          </div>
          <div className="max-w-full">
            <Table>
              <TableCaption>A list of your signatures.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Key</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>LPS</TableHead>
                  <TableHead>Settings</TableHead>
                  <TableHead className="text-right">Schema</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className=" overflow-auto">
                {stackData.signatures.map((signature: any, index: number) => (
                  <TableRow key={signature.signatureId}>
                    <TableCell className="font-medium">
                      {signature.key}
                    </TableCell>
                    <TableCell>{signature.topic}</TableCell>
                    {status === "Offline" ? (
                      <TableCell className=" text-red-500">Halted</TableCell>
                    ) : stackStatus ? (
                      stackStatus.has(params.stack_id as string) ? (
                        stackStatus
                          .get(params.stack_id as string)!
                          .get("Running")!
                          .has(signature.topic) ? (
                          <TableCell className=" text-green-500">
                            Active
                          </TableCell>
                        ) : (
                          <TableCell className=" text-red-500">
                            Halted
                          </TableCell>
                        )
                      ) : (
                        <TableCell className=" text-red-500">Halted</TableCell>
                      )
                    ) : (
                      <TableCell className=" text-red-500">Halted</TableCell>
                    )}
                    <TableCell>
                      {(() => {
                        let totalLPS = 0;
                        if (lpsUpdate === null || status === "Offline") {
                          return 0;
                        }
                        if (lpsUpdate.has(signature.topic)) {
                          totalLPS += lpsUpdate.get(signature.topic)!;
                        }
                        return totalLPS;
                      })()}
                    </TableCell>
                    <TableCell>
                      <SignatureDialog
                        signature={signature}
                        canDelete={
                          stackData.signatures.length === 1 ? false : true
                        }
                        onSuccess={refetch}
                      ></SignatureDialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        onClick={() => setSignatureView(signature.schema)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className=" h-[500px] flex flex-col gap-2">
          <h1 className=" font-semibold text-base">Signature Schema</h1>
          <div className=" w-full h-full border rounded-xl p-8 overflow-y-auto">
            {signatureView === "" ? null : (
              <JSONEditor
                id={`jsoneditor`}
                placeholder={JSON.parse(signatureView)}
                locale={locale}
                viewOnly={true}
                // theme="light_mitsuketa_tribute"
                colors={{
                  background: "transparent",
                  default: "#D4D4D4",
                  string: "#CE9178",
                  number: "#B5CEA8",
                  colon: "#49B8F7",
                  keys: "#9CDCFE",
                  // error: "#F44336",
                }}
                //   height="200px"
                width="100%"
              />
            )}
          </div>
        </div>
      </div>
      <div className=" grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-8 grid-rows-1">
        {stackData["components"].map((component: any, index: number) =>
          component["viewer"]["name"] === "LineChart" ? (
            <GraphComponent
              key={component["componentId"]}
              topic={component["signature"]["topic"]}
              condition={component["dataPath"]}
              name={component["name"]}
              description={component["description"]}
              onDelete={() =>
                deleteCompo(component["signatureId"], component["componentId"])
              }
            />
          ) : component["viewer"]["name"] === "Terminal" ? (
            <Terminal
              key={component["componentId"]}
              topic={component["signature"]["topic"]}
              condition={component["dataPath"]}
              name={component["name"]}
              description={component["description"]}
              onDelete={() =>
                deleteCompo(component["signatureId"], component["componentId"])
              }
            ></Terminal>
          ) : null
        )}
      </div>
    </div>
  );
}
