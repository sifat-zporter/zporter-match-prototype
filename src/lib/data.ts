export type Team = {
  id: string;
  name: string;
  logoUrl: string;
};

export type League = {
  id: string;
  name: string;
  logoUrl: string;
};

export type MatchEvent = {
  time: number;
  type: 'Goal' | 'Yellow Card' | 'Red Card' | 'Substitution';
  player: string;
  team: 'home' | 'away';
  details?: string;
};

export type MatchStats = {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnGoal: { home: number; away: number };
  fouls: { home: number; away: number };
  corners: { home: number; away: number };
  offsides: { home: number; away: number };
};

export type Match = {
  id: string;
  status: 'scheduled' | 'live' | 'finished';
  startTime: string;
  time?: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  scores: {
    home: number;
    away: number;
  };
  events: MatchEvent[];
  stats: MatchStats;
};

const teams: Record<string, Team> = {
  majFC: { id: 'majFC', name: 'Maj FC', logoUrl: 'https://placehold.co/40x40.png' },
  fcBarcelona: { id: 'fcBarcelona', name: 'FC Barcelona', logoUrl: 'https://placehold.co/40x40.png' },
  fcCopenhagen: { id: 'fcCopenhagen', name: 'FC Copenhagen', logoUrl: 'https://placehold.co/40x40.png' },
  lyngby: { id: 'lyngby', name: 'Lyngby FC', logoUrl: 'https://placehold.co/40x40.png' },
  realMadrid: { id: 'realMadrid', name: 'Real Madrid', logoUrl: 'https://placehold.co/40x40.png' },
  athleticBilbao: { id: 'athleticBilbao', name: 'Athletic Bilbao', logoUrl: 'https://placehold.co/40x40.png' },
  manchesterUnited: { id: 'manchesterUnited', name: 'Manchester United', logoUrl: 'https://placehold.co/40x40.png' },
  juventus: { id: 'juventus', name: 'Juventus', logoUrl: 'https://placehold.co/40x40.png' },
  chelsea: { id: 'chelsea', name: 'Chelsea FC', logoUrl: 'https://placehold.co/40x40.png' },
  tottenham: { id: 'tottenham', name: 'Tottenham Hotspur', logoUrl: 'https://placehold.co/40x40.png' },
  arsenal: { id: 'arsenal', name: 'Arsenal FC', logoUrl: 'https://placehold.co/40x40.png' },
  ipswich: { id: 'ipswich', name: 'Ipswich', logoUrl: 'https://placehold.co/40x40.png' },
};

const leagues: Record<string, League> = {
  u19Cup: { id: 'u19Cup', name: 'U-19 Cup', logoUrl: 'https://placehold.co/24x24.png' },
  laLiga: { id: 'laLiga', name: 'La Liga', logoUrl: 'https://placehold.co/24x24.png' },
  premierLeague: { id: 'premierLeague', name: 'Premier League', logoUrl: 'https://placehold.co/24x24.png' },
  faCup: { id: 'faCup', name: 'FA Cup', logoUrl: 'https://placehold.co/24x24.png' },
  serieA: { id: 'serieA', name: 'Serie A', logoUrl: 'https://placehold.co/24x24.png' },
};

export const matches: Match[] = [
  {
    id: '1',
    status: 'live',
    startTime: '17:12',
    time: "68'",
    homeTeam: teams.majFC,
    awayTeam: teams.fcBarcelona,
    league: leagues.u19Cup,
    scores: { home: 0, away: 3 },
    events: [
      { time: 23, type: 'Goal', player: 'L. Yamal', team: 'away' },
      { time: 45, type: 'Yellow Card', player: 'P. Cubarsi', team: 'away' },
      { time: 55, type: 'Goal', player: 'F. Lopez', team: 'away' },
    ],
    stats: {
      possession: { home: 42, away: 58 },
      shots: { home: 8, away: 12 },
      shotsOnGoal: { home: 3, away: 5 },
      fouls: { home: 14, away: 10 },
      corners: { home: 3, away: 6 },
      offsides: { home: 1, away: 2 },
    },
  },
  {
    id: '2',
    status: 'live',
    startTime: '17:12',
    time: 'HT',
    homeTeam: teams.fcCopenhagen,
    awayTeam: teams.lyngby,
    league: leagues.u19Cup,
    scores: { home: 0, away: 2 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 5, away: 7 }, shotsOnGoal: { home: 2, away: 4 }, fouls: { home: 8, away: 8 }, corners: { home: 4, away: 2 }, offsides: { home: 1, away: 0 } },
  },
  {
    id: '3',
    status: 'scheduled',
    startTime: '17:12',
    homeTeam: teams.realMadrid,
    awayTeam: teams.athleticBilbao,
    league: leagues.laLiga,
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
  },
  {
    id: '4',
    status: 'scheduled',
    startTime: '17:12',
    homeTeam: teams.manchesterUnited,
    awayTeam: teams.juventus,
    league: leagues.premierLeague,
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
  },
   {
    id: '5',
    status: 'scheduled',
    startTime: '17:12',
    homeTeam: teams.chelsea,
    awayTeam: teams.tottenham,
    league: leagues.faCup,
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
  },
  {
    id: '6',
    status: 'finished',
    startTime: '17:12',
    time: 'FT',
    homeTeam: teams.arsenal,
    awayTeam: teams.ipswich,
    league: leagues.premierLeague,
    scores: { home: 2, away: 1 },
    events: [],
    stats: { possession: { home: 65, away: 35 }, shots: { home: 15, away: 6 }, shotsOnGoal: { home: 7, away: 2 }, fouls: { home: 9, away: 12 }, corners: { home: 8, away: 2 }, offsides: { home: 3, away: 1 } },
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return matches.find((match) => match.id === id);
};
