"use client";
import React, { useState, useEffect } from "react";
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

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type DataPoint = {
  timestamp: number; // Unix timestamp in milliseconds
  value: any;
};

interface GraphComponentProps {
  data: any[];
  condition: string;
  onRemove: () => void;
  name: string;
  description: string;
}

export const GraphComponent: React.FC<GraphComponentProps> = ({
  data,
  condition,
  onRemove,
  name,
  description,
}) => {
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);

  function extractValuesByPath(jsonArray: any[], path: string): DataPoint[] {
    const keys = path.split(".");

    return jsonArray
      .map((obj: any) => {
        let value: any = obj;
        for (const key of keys) {
          if (value && typeof value === "object" && key in value) {
            value = value[key];
          } else {
            value = undefined;
            break;
          }
        }
        // Ensure timestamp is set properly and value is valid
        return value !== undefined
          ? { timestamp: new Date().getTime(), value } // Use current timestamp
          : undefined;
      })
      .filter((result: DataPoint | undefined): result is DataPoint =>
        result !== undefined
      );
  }

  useEffect(() => {
    const newData = extractValuesByPath(data, condition);
    console.log("Extracted Data:", newData); // Debugging output
    setFilteredData(newData);
  }, [data, condition]);

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3>{name}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button variant="secondary" onClick={onRemove}>
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
                tickFormatter={formatXAxis}
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
              />
              <YAxis />
              <Tooltip
                content={<ChartTooltipContent className="w-[150px]" />}
                labelFormatter={(value) =>
                  new Date(value).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })
                }
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
    </Card>
  );
};
