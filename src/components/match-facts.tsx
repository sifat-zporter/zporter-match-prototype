import type { Match, TeamForm, PastMeeting, Player, Standings } from "@/lib/data";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";

const FormIndicator = ({ form }: { form: TeamForm }) => {
    const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white";
    const variantClasses = {
        'W': 'bg-green-500',
        'D': 'bg-gray-500',
        'L': 'bg-red-500'
    };
    return <div className={cn(baseClasses, variantClasses[form])}>{form}</div>;
}

const PastMeetingRow = ({ meeting }: { meeting: PastMeeting }) => (
    <div className="flex items-center justify-between p-3 hover:bg-accent rounded-lg">
        <div className="flex-1 text-center font-semibold">{meeting.homeTeam}</div>
        <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">{meeting.homeScore}</span>
            <span>-</span>
            <span className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold">{meeting.awayScore}</span>
        </div>
        <div className="flex-1 text-center font-semibold">{meeting.awayTeam}</div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </div>
)

const PlayerStatRow = ({ player, rank }: { player: Player, rank: number }) => (
    <div className="flex items-center gap-2 text-sm">
        {/* Placeholder for flag */}
        <div className="w-5 h-4 bg-muted rounded-sm"></div> 
        <div>
            <p className="font-semibold">{player.name}</p>
            <p className="text-xs text-muted-foreground">{player.year} • {player.number} • {player.position}</p>
        </div>
        <div className="ml-auto w-6 h-6 rounded-full bg-card flex items-center justify-center text-xs font-bold">{rank}</div>
    </div>
)

const GoalTimeline = () => (
    <div className="flex justify-around">
        <div className="w-1/3">
             <div className="h-20 flex items-end gap-0.5">
                <div className="w-1/4 h-[20%] bg-primary"></div>
                <div className="w-1/4 h-[40%] bg-primary"></div>
                <div className="w-1/4 h-[60%] bg-primary"></div>
                <div className="w-1/4 h-[80%] bg-primary"></div>
            </div>
             <div className="h-8 flex items-start gap-0.5">
                <div className="w-1/4 h-[30%] bg-red-500"></div>
                <div className="w-1/4 h-[10%] bg-red-500"></div>
                <div className="w-1/4 h-[50%] bg-red-500"></div>
                <div className="w-1/4 h-[20%] bg-red-500"></div>
            </div>
        </div>
        <div className="w-1/3">
             <div className="h-20 flex items-end gap-0.5">
                <div className="w-1/4 h-[30%] bg-primary"></div>
                <div className="w-1/4 h-[50%] bg-primary"></div>
                <div className="w-1/4 h-[20%] bg-primary"></div>
                <div className="w-1/4 h-[90%] bg-primary"></div>
            </div>
             <div className="h-8 flex items-start gap-0.5">
                <div className="w-1/4 h-[10%] bg-red-500"></div>
                <div className="w-1/4 h-[40%] bg-red-500"></div>
                <div className="w-1/4 h-[20%] bg-red-500"></div>
                <div className="w-1/4 h-[60%] bg-red-500"></div>
            </div>
        </div>
    </div>
)

const AverageStatRow = ({ label, home, away }: { label: string, home: number | string, away: number | string }) => (
    <div className="flex justify-between items-center py-2">
        <span className="font-bold text-primary">{home}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-bold text-red-500">{away}</span>
    </div>
)

export function MatchFacts({ match }: { match: Match }) {
  return (
    <div className="space-y-6 py-4">
      {match.teamForm && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-center font-semibold mb-3">Last 5 matches</h3>
            <div className="flex justify-between">
                <div className="flex gap-2"><FormIndicator form={match.teamForm.home[0]} /><FormIndicator form={match.teamForm.home[1]} /><FormIndicator form={match.teamForm.home[2]} /><FormIndicator form={match.teamForm.home[3]} /><FormIndicator form={match.teamForm.home[4]} /></div>
                <div className="flex gap-2"><FormIndicator form={match.teamForm.away[0]} /><FormIndicator form={match.teamForm.away[1]} /><FormIndicator form={match.teamForm.away[2]} /><FormIndicator form={match.teamForm.away[3]} /><FormIndicator form={match.teamForm.away[4]} /></div>
            </div>
          </CardContent>
        </Card>
      )}

      {match.pastMeetings && (
          <Card className="relative">
              <CardContent className="p-4">
                <h3 className="text-center font-semibold mb-3">Last 5 meetings</h3>
                <div className="space-y-1">
                    {match.pastMeetings.map(meeting => <PastMeetingRow key={meeting.id} meeting={meeting}/>)}
                </div>
              </CardContent>
               <Button className="absolute bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
                    <Plus className="w-6 h-6" />
                </Button>
          </Card>
      )}

      {match.topGoalscorers && (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-center font-semibold mb-3">Top 3 Goalscorers</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        {match.topGoalscorers.home.map((p, i) => <PlayerStatRow key={p.id} player={p} rank={i+1} />)}
                    </div>
                    <div className="space-y-3">
                         {match.topGoalscorers.away.map((p, i) => <PlayerStatRow key={p.id} player={p} rank={i+1} />)}
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {match.topAssists && (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-center font-semibold mb-3">Top 3 Assists</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        {match.topAssists.home.map((p, i) => <PlayerStatRow key={p.id} player={p} rank={i+1} />)}
                    </div>
                    <div className="space-y-3">
                         {match.topAssists.away.map((p, i) => <PlayerStatRow key={p.id} player={p} rank={i+1} />)}
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {match.averageStats && (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-center font-semibold mb-3">Goal Timeline</h3>
                <GoalTimeline />
                <div className="mt-4 divide-y divide-border">
                    <AverageStatRow label="Average Goals" home={match.averageStats.goals.home} away={match.averageStats.goals.away} />
                    <AverageStatRow label="Average let in goals" home={match.averageStats.goalsLetIn.home} away={match.averageStats.goalsLetIn.away} />
                    <AverageStatRow label="Net Score" home={match.averageStats.netScore.home} away={match.averageStats.netScore.away} />
                    <AverageStatRow label="Average Points" home={match.averageStats.points.home} away={match.averageStats.points.away} />
                    <AverageStatRow label="Average Age" home={match.averageStats.age.home} away={match.averageStats.age.away} />
                    <AverageStatRow label="Average Weight" home={`${match.averageStats.weight.home} kg`} away={`${match.averageStats.weight.away} kg`} />
                    <AverageStatRow label="Average Height" home={`${match.averageStats.height.home} cm`} away={`${match.averageStats.height.away} cm`} />
                    <AverageStatRow label="Average Star Reviews" home={match.averageStats.starReviews.home} away={match.averageStats.starReviews.away} />
                </div>
            </CardContent>
        </Card>
      )}

      {match.standings && (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-center font-semibold mb-3">Table</h3>
                <h4 className="font-medium text-sm mb-2">Group 1</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="p-2">#</TableHead>
                            <TableHead className="p-2 w-full">Team</TableHead>
                            <TableHead className="p-2">PLD</TableHead>
                            <TableHead className="p-2">GD</TableHead>
                            <TableHead className="p-2">PTS</TableHead>
                            <TableHead className="p-2"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {match.standings.map((s, i) => (
                             <TableRow key={s.team.id}>
                                <TableCell className="p-2">{i+1}</TableCell>
                                <TableCell className="p-2 flex items-center gap-2">
                                    <Image src={s.team.logoUrl} alt={s.team.name} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                    <span>{s.team.name}</span>
                                </TableCell>
                                <TableCell className="p-2">{s.pld}</TableCell>
                                <TableCell className="p-2">{s.gd > 0 ? `+${s.gd}` : s.gd}</TableCell>
                                <TableCell className="p-2 font-bold">{s.pts}</TableCell>
                                <TableCell className="p-2"><ChevronRight className="w-4 h-4 text-muted-foreground" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
