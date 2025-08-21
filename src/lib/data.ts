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
  galaxy: { id: 'galaxy', name: 'North FC Galaxy', logoUrl: 'https://placehold.co/40x40.png' },
  united: { id: 'united', name: 'South City United', logoUrl: 'https://placehold.co/40x40.png' },
  rovers: { id: 'rovers', name: 'Easton Rovers', logoUrl: 'https://placehold.co/40x40.png' },
  olympic: { id: 'olympic', name: 'Westwood Olympic', logoUrl: 'https://placehold.co/40x40.png' },
  eagles: { id: 'eagles', name: 'Golden Eagles', logoUrl: 'https://placehold.co/40x40.png' },
  sharks: { id: 'sharks', name: 'Coastal Sharks', logoUrl: 'https://placehold.co/40x40.png' },
};

const leagues: Record<string, League> = {
  u19premier: { id: 'u19premier', name: 'U19 Premier League', logoUrl: 'https://placehold.co/24x24.png' },
  youthcup: { id: 'youthcup', name: 'Youth FA Cup', logoUrl: 'https://placehold.co/24x24.png' },
};

export const matches: Match[] = [
  {
    id: '1',
    status: 'live',
    startTime: '20:00',
    time: "68'",
    homeTeam: teams.galaxy,
    awayTeam: teams.united,
    league: leagues.u19premier,
    scores: { home: 1, away: 1 },
    events: [
      { time: 23, type: 'Goal', player: 'J. Smith', team: 'home', details: 'Assist by A. Davis' },
      { time: 45, type: 'Yellow Card', player: 'T. Brown', team: 'away' },
      { time: 55, type: 'Goal', player: 'L. White', team: 'away', details: 'Penalty' },
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shotsOnGoal: { home: 5, away: 3 },
      fouls: { home: 10, away: 14 },
      corners: { home: 6, away: 3 },
      offsides: { home: 2, away: 1 },
    },
  },
  {
    id: '2',
    status: 'finished',
    startTime: '18:00',
    time: 'FT',
    homeTeam: teams.rovers,
    awayTeam: teams.olympic,
    league: leagues.u19premier,
    scores: { home: 2, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 10, away: 10 }, shotsOnGoal: { home: 5, away: 5 }, fouls: { home: 8, away: 8 }, corners: { home: 4, away: 4 }, offsides: { home: 1, away: 1 } },
  },
  {
    id: '3',
    status: 'scheduled',
    startTime: '21:00',
    homeTeam: teams.eagles,
    awayTeam: teams.sharks,
    league: leagues.youthcup,
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
  },
  {
    id: '4',
    status: 'finished',
    startTime: '16:00',
    time: 'FT',
    homeTeam: teams.united,
    awayTeam: teams.rovers,
    league: leagues.u19premier,
    scores: { home: 3, away: 3 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 10, away: 10 }, shotsOnGoal: { home: 5, away: 5 }, fouls: { home: 8, away: 8 }, corners: { home: 4, away: 4 }, offsides: { home: 1, away: 1 } },
  },
  {
    id: '5',
    status: 'scheduled',
    startTime: '19:30',
    homeTeam: teams.olympic,
    awayTeam: teams.galaxy,
    league: leagues.youthcup,
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return matches.find((match) => match.id === id);
};
