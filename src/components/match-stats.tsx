"use client"

import type { MatchStats as MatchStatsType } from "@/lib/data";
import { cn } from "@/lib/utils";

interface MatchStatsProps {
  stats: MatchStatsType;
}

interface StatRowProps {
  label: string;
  home: number | string;
  away: number | string;
  home_max: number;
  away_max: number;
  colorClass?: string;
  isPercentage?: boolean;
}

const StatRow = ({ label, home, away, home_max, away_max, colorClass = "bg-primary/80", isPercentage = false }: StatRowProps) => {
  const homeValue = typeof home === 'string' ? parseFloat(home) : home;
  const awayValue = typeof away === 'string' ? parseFloat(away) : away;

  const homeWidth = isPercentage ? homeValue : (homeValue / home_max) * 100;
  const awayWidth = isPercentage ? awayValue : (awayValue / away_max) * 100;
  
  const homeDisplay = isPercentage ? `${home}%` : home;
  const awayDisplay = isPercentage ? `${away}%` : away;

  return (
    <div className="flex items-center text-sm font-medium">
      <div className="w-10 text-right font-semibold">{homeDisplay}</div>
      <div className="flex-1 px-4">
        <div className="relative h-6 bg-card rounded-md overflow-hidden">
          <div className="absolute top-0 left-0 h-full" style={{ width: `${homeWidth}%` }}>
             <div className={cn("h-full w-full", colorClass)} />
          </div>
        </div>
      </div>
      <div className="w-40 text-center text-muted-foreground text-xs uppercase">{label}</div>
      <div className="flex-1 px-4">
        <div className="relative h-6 bg-card rounded-md overflow-hidden">
          <div className="absolute top-0 right-0 h-full" style={{ width: `${awayWidth}%` }}>
             <div className={cn("h-full w-full", colorClass)} />
          </div>
        </div>
      </div>
      <div className="w-10 text-left font-semibold">{awayDisplay}</div>
    </div>
  )
}

export function MatchStats({ stats }: MatchStatsProps) {
  const allStats = [
    stats.goals,
    stats.shots,
    stats.shotsOnGoal,
    stats.penalties,
    stats.corners,
    stats.freeKicks,
    stats.throwIns,
    stats.offsides,
    stats.yellowCards,
    stats.redCards,
    stats.possessionMinutes,
    stats.passesOn,
    stats.passesOff,
    stats.wonBalls,
  ].flatMap(s => [s.home, s.away]);

  const maxStat = Math.max(...allStats);

  return (
    <div className="space-y-2 py-4">
      <StatRow label="Goals" home={stats.goals.home} away={stats.goals.away} home_max={maxStat} away_max={maxStat} colorClass="bg-muted-foreground/50" />
      <StatRow label="Shots on Goal" home={stats.shotsOnGoal.home} away={stats.shotsOnGoal.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Shots off Goal" home={stats.shots.home - stats.shotsOnGoal.home} away={stats.shots.away - stats.shotsOnGoal.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Penalties" home={stats.penalties.home} away={stats.penalties.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Corners" home={stats.corners.home} away={stats.corners.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Free Kicks" home={stats.freeKicks.home} away={stats.freeKicks.away} home_max={maxStat} away_max={maxStat} colorClass="bg-muted-foreground/50" />
      <StatRow label="Throw Ins" home={stats.throwIns.home} away={stats.throwIns.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Offsides" home={stats.offsides.home} away={stats.offsides.away} home_max={maxStat} away_max={maxStat} colorClass="bg-yellow-600" />
      <StatRow label="Yellow Cards" home={stats.yellowCards.home} away={stats.yellowCards.away} home_max={maxStat} away_max={maxStat} colorClass="bg-yellow-400" />
      <StatRow label="Red Cards" home={stats.redCards.home} away={stats.redCards.away} home_max={maxStat} away_max={maxStat} colorClass="bg-red-500" />
      <StatRow label="Possession" home={`${stats.possession.home}`} away={`${stats.possession.away}`} home_max={100} away_max={100} isPercentage={true} />
      <StatRow label="Possession Minutes" home={stats.possessionMinutes.home} away={stats.possessionMinutes.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Passes On" home={stats.passesOn.home} away={stats.passesOn.away} home_max={maxStat} away_max={maxStat} />
      <StatRow label="Passes Off" home={stats.passesOff.home} away={stats.passesOff.away} home_max={maxStat} away_max={maxStat} colorClass="bg-yellow-600" />
      <StatRow label="Won Balls" home={stats.wonBalls.home} away={stats.wonBalls.away} home_max={maxStat} away_max={maxStat} />
    </div>
  )
}
