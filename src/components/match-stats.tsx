"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import type { MatchStats as MatchStatsType } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface MatchStatsProps {
  stats: MatchStatsType;
}

export function MatchStats({ stats }: MatchStatsProps) {
  const chartData = [
    { name: 'Shots on Goal', home: stats.shotsOnGoal.home, away: stats.shotsOnGoal.away },
    { name: 'Shots off Goal', home: stats.shots.home - stats.shotsOnGoal.home, away: stats.shots.away - stats.shotsOnGoal.away },
    { name: 'Possession %', home: stats.possession.home, away: stats.possession.away },
    { name: 'Corners', home: stats.corners.home, away: stats.corners.away },
    { name: 'Offsides', home: stats.offsides.home, away: stats.offsides.away },
    { name: 'Fouls', home: stats.fouls.home, away: stats.fouls.away },
  ];

  const chartConfig = {
      home: { label: "Home", color: "hsl(var(--primary))" },
      away: { label: "Away", color: "hsl(var(--muted-foreground))" },
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Possession</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">{stats.possession.home}%</span>
            <Progress value={stats.possession.home} className="flex-1" />
            <span className="font-bold text-lg">{stats.possession.away}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
             <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                    className="text-xs"
                />
                <XAxis dataKey="home" type="number" hide />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Legend />
                <Bar dataKey="home" fill="var(--color-home)" radius={4} stackId="a" />
                <Bar dataKey="away" fill="var(--color-away)" radius={4} stackId="a" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
