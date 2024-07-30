"use client"
import React, { useState, useEffect } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export const GraphComponent = ({ data, condition, onRemove }:{
    data:any,
    condition:any,
    onRemove:any
}) => {
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    // This is where you'd apply the condition to filter the data
    // For now, we'll just use all the data
    setFilteredData(data)
  }, [data, condition])

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Graph: {condition}</CardTitle>
        <Button variant="destructive" onClick={onRemove}>Remove</Button>
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
              animateNewValues={true}
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
    </Card>
  )
}