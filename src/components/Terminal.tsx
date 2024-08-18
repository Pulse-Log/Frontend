import { useSocketState } from "@/contexts/web-socket-context";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface TerminalProps {
  condition: string;
  name: string;
  description: string;
  topic: string;
  onDelete: any;
}

type DataLog = {
  timestamp: number;
  value: any;
};

export const Terminal: React.FC<TerminalProps> = ({
  condition,
  name,
  description,
  topic,
  onDelete
}) => {
  const { bufferedLogs } = useSocketState();
  const [filteredData, setFilteredData] = useState<DataLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[1].slice(0, -1);
  };

  const extractValuesByPath = useCallback((log: any, path: string): DataLog | undefined => {
    console.log(log);
    if (!log || typeof log !== 'object' || log.topic!==topic) return undefined;
    const keys = path.split(".");
    let value: any = log;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value !== undefined ? { timestamp: Number(log.timestamp), value } : undefined;
  }, [topic]);

  useEffect(() => {
    const newDataPoints = bufferedLogs
      .map(log => extractValuesByPath(log, condition))
      .filter((point): point is DataLog => point !== undefined);

    setFilteredData(prevData => {
      const updatedData = [...prevData, ...newDataPoints];
      return updatedData.slice(-400);
    });
  }, [bufferedLogs, condition, extractValuesByPath]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredData]);

  return (
    <Card className="w-full bg-black rounded-xl">
      <CardHeader className="flex rounded-xl flex-row items-center justify-between bg-card text-foreground border-b">
        <div>
          <h3 className="text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="secondary" onClick={onDelete}>
          Remove
        </Button>
      </CardHeader>
      <CardContent 
        ref={logContainerRef}
        className="h-[300px] w-full overflow-y-auto p-4 font-mono text-sm bg-black text-green-500"
      >
        {filteredData.map((log, index) => (
          <div key={index + log.timestamp} className="mb-1">
            <span className="text-muted-foreground">[{formatTimestamp(log.timestamp)}]</span>
            <span className="ml-2">{JSON.stringify(log.value)}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-card rounded-xl text-muted-foreground text-xs border-t">
        <div ><p className=" text-sm">Configured at {condition}</p></div>
      </CardFooter>
    </Card>
  );
};