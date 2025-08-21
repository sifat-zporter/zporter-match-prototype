"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { MatchStats } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MatchStatsProps {
  stats: MatchStats;
}

export function MatchStats({ stats }: MatchStatsProps) {
  const chartData = [
    { name: 'Shots', home: stats.shots.home, away: stats.shots.away },
    { name: 'On Goal', home: stats.shotsOnGoal.home, away: stats.shotsOnGoal.away },
    { name: 'Fouls', home: stats.fouls.home, away: stats.fouls.away },
    { name: 'Corners', home: stats.corners.home, away: stats.corners.away },
    { name: 'Offsides', home: stats.offsides.home, away: stats.offsides.away },
  ];

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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" barSize={20}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={80}
                />
                <Bar dataKey="home" stackId="a" fill="hsl(var(--primary))" radius={[4, 0, 0, 4]} />
                <Bar dataKey="away" stackId="a" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
