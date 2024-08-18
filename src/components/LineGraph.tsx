"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSocketState } from "@/contexts/web-socket-context";

const chartConfig = {
  value: {
    label: "Value",
    color: "blue",
  },
} satisfies ChartConfig;

type DataPoint = {
  timestamp: number; // Unix timestamp in milliseconds
  value: any;
};

interface GraphComponentProps {
  condition: string;
  name: string;
  topic: string;
  description: string;
  onDelete: any;
}

export const GraphComponent: React.FC<GraphComponentProps> = ({
  condition,
  name,
  description,
  topic,
  onDelete
}) => {
  const {bufferedLogs} = useSocketState();
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  console.log("Rendering: "+filteredData.length);

  const extractValuesByPath = useCallback((log: any, path: string): DataPoint | undefined => {
    if (!log || typeof log !== 'object'|| log.topic!==topic) {
      return undefined;
    }
    const keys = path.split(".");
    let value: any = log;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    if (value !== undefined && !isNaN(value)) {
      return { timestamp: Number(log.timestamp), value: value };
    }
    return undefined;
  }, [topic]);

  useEffect(() => {
    const newDataPoints = bufferedLogs
      .map(log => extractValuesByPath(log, condition))
      .filter((point): point is DataPoint => point !== undefined);

    setFilteredData(prevData => {
      const updatedData = [...prevData, ...newDataPoints];
      return updatedData.slice(-400);
    });
  }, [bufferedLogs, condition, extractValuesByPath]);

  console.log(filteredData);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  };

  return (<Card >
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <h3>{name}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button variant="secondary" onClick={onDelete}>
        Remove
      </Button>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatTimestamp}
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
            />
            <YAxis />
            <Tooltip
              content={<ChartTooltipContent className="w-[150px]" />}
              labelFormatter={(value, payload) => {
                if (payload && payload.length > 0) {
                  const timestamp = payload[0].payload.timestamp;
                  return formatTimestamp(timestamp);
                }
                return "Invalid Timestamp";
              }}
            />
            <Line
              isAnimationActive={false}
              dataKey="value"
              type="monotone"
              stroke={`var(--color-value)`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="leading-none text-muted-foreground">
        Configured at {condition}
      </div>
    </CardFooter>
  </Card>)
  // return useMemo(()=>(
  //   <Card >
  //     <CardHeader className="flex flex-row items-center justify-between">
  //       <div>
  //         <h3>{name}</h3>
  //         <p className="text-muted-foreground">{description}</p>
  //       </div>
  //       <Button variant="secondary">
  //         Remove
  //       </Button>
  //     </CardHeader>
  //     <CardContent>
  //       <ChartContainer
  //         config={chartConfig}
  //         className="aspect-auto h-[250px] w-full"
  //       >
  //         <ResponsiveContainer width="100%" height="100%">
  //           <LineChart data={filteredData}>
  //             <CartesianGrid vertical={false} />
  //             <XAxis
  //               dataKey="timestamp"
  //               tickLine={false}
  //               axisLine={false}
  //               tickMargin={8}
  //               minTickGap={32}
  //               tickFormatter={formatTimestamp}
  //               type="number"
  //               domain={['dataMin', 'dataMax']}
  //               scale="time"
  //             />
  //             <YAxis />
  //             <Tooltip
  //               content={<ChartTooltipContent className="w-[150px]" />}
  //               labelFormatter={(value, payload) => {
  //                 if (payload && payload.length > 0) {
  //                   const timestamp = payload[0].payload.timestamp;
  //                   return formatTimestamp(timestamp);
  //                 }
  //                 return "Invalid Timestamp";
  //               }}
  //             />
  //             <Line
  //               isAnimationActive={false}
  //               dataKey="value"
  //               type="monotone"
  //               stroke={`var(--color-value)`}
  //               strokeWidth={2}
  //               dot={false}
  //             />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </ChartContainer>
  //     </CardContent>
  //     <CardFooter className="flex-col items-start gap-2 text-sm">
  //       <div className="leading-none text-muted-foreground">
  //         Configured at {condition}
  //       </div>
  //     </CardFooter>
  //   </Card>
  // ),[condition,description,filteredData, name])
};