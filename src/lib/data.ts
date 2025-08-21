
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

export type Player = {
  id: string;
  name: string;
  avatarUrl: string;
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
  date: string;
  startTime: string;
  time?: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  stadium: string;
  scores: {
    home: number;
    away: number;
  };
  events: MatchEvent[];
  stats: MatchStats;
  featuredPlayers?: Player[];
};

const teams: Record<string, Team> = {
  majFC: { id: 'majFC', name: 'Maj FC-U15', logoUrl: 'https://placehold.co/40x40.png' },
  fcBarcelona: { id: 'fcBarcelona', name: 'FC Barcelona-U15', logoUrl: 'https://placehold.co/40x40.png' },
  fcCopenhagen: { id: 'fcCopenhagen', name: 'FC Copenhagen-U17', logoUrl: 'https://placehold.co/40x40.png' },
  lyngby: { id: 'lyngby', name: 'Lyngby FC-U17', logoUrl: 'https://placehold.co/40x40.png' },
  realMadrid: { id: 'realMadrid', name: 'Real Madrid', logoUrl: 'https://placehold.co/40x40.png' },
  athleticBilbao: { id: 'athleticBilbao', name: 'Athletic Bilbao', logoUrl: 'https://placehold.co/40x40.png' },
  manchesterUnited: { id: 'manchesterUnited', name: 'Manchester United', logoUrl: 'https://placehold.co/40x40.png' },
  westHam: { id: 'westHam', name: 'West Ham United', logoUrl: 'https://placehold.co/40x40.png' },
  juventus: { id: 'juventus', name: 'Juventus', logoUrl: 'https://placehold.co/40x40.png' },
  roma: { id: 'roma', name: 'Roma', logoUrl: 'https://placehold.co/40x40.png' },
  chelsea: { id: 'chelsea', name: 'Chelsea FC', logoUrl: 'https://placehold.co/40x40.png' },
  tottenham: { id: 'tottenham', name: 'Tottenham Hotspur', logoUrl: 'https://placehold.co/40x40.png' },
  arsenal: { id: 'arsenal', name: 'Arsenal FC', logoUrl: 'https://placehold.co/40x40.png' },
  ipswich: { id: 'ipswich', name: 'Ipswich', logoUrl: 'https://placehold.co/40x40.png' },
};

const leagues: Record<string, League> = {
  u19Cup: { id: 'u19Cup', name: 'U-19 Cup', logoUrl: 'https://placehold.co/24x24.png' },
  u17Liga: { id: 'u17Liga', name: 'U17 Liga, R-3', logoUrl: 'https://placehold.co/24x24.png' },
  laLiga: { id: 'laLiga', name: 'La Liga, R-17', logoUrl: 'https://placehold.co/24x24.png' },
  premierLeague: { id: 'premierLeague', name: 'Premier League, R-19', logoUrl: 'https://placehold.co/24x24.png' },
  serieA: { id: 'serieA', name: 'Serie A, R-13', logoUrl: 'https://placehold.co/24x24.png' },
  faCup: { id: 'faCup', name: 'FA Cup, R-5', logoUrl: 'https://placehold.co/24x24.png' },
};

const players: Record<string, Player> = {
  neoJonsson: { id: 'neoJonsson', name: 'Neo Jönsson', avatarUrl: 'https://placehold.co/40x40.png' },
  philipPawlowski: { id: 'philipPawlowski', name: 'Philip Pawlowski', avatarUrl: 'https://placehold.co/40x40.png' },
  erlingHaaland: { id: 'erlingHaaland', name: 'Erling Haaland', avatarUrl: 'https://placehold.co/40x40.png' },
  kylianMbappe: { id: 'kylianMbappe', name: 'Kylian Mbappé', avatarUrl: 'https://placehold.co/40x40.png' },
};


export const matches: Match[] = [
  {
    id: '1',
    status: 'live',
    date: '17/12',
    startTime: '10:00',
    time: "68'",
    homeTeam: teams.majFC,
    awayTeam: teams.fcBarcelona,
    league: leagues.u19Cup,
    stadium: 'Norrvikens IP, 1',
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
    featuredPlayers: [players.neoJonsson]
  },
  {
    id: '2',
    status: 'live',
    date: '17/12',
    startTime: '11:00',
    time: 'HT',
    homeTeam: teams.fcCopenhagen,
    awayTeam: teams.lyngby,
    league: leagues.u17Liga,
    stadium: 'KB Arena',
    scores: { home: 2, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 5, away: 7 }, shotsOnGoal: { home: 2, away: 4 }, fouls: { home: 8, away: 8 }, corners: { home: 4, away: 2 }, offsides: { home: 1, away: 0 } },
    featuredPlayers: [players.philipPawlowski]
  },
  {
    id: '3',
    status: 'scheduled',
    date: '17/12',
    startTime: '14:00',
    homeTeam: teams.realMadrid,
    awayTeam: teams.athleticBilbao,
    league: leagues.laLiga,
    stadium: 'Santiago Bernabéu',
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
    featuredPlayers: [players.erlingHaaland]
  },
  {
    id: '4',
    status: 'scheduled',
    date: '17/12',
    startTime: '16:00',
    homeTeam: teams.manchesterUnited,
    awayTeam: teams.westHam,
    league: leagues.premierLeague,
    stadium: 'Old Trafford',
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
    featuredPlayers: [players.kylianMbappe]
  },
   {
    id: '5',
    status: 'scheduled',
    date: '17/12',
    startTime: '16:00',
    homeTeam: teams.juventus,
    awayTeam: teams.roma,
    league: leagues.serieA,
    stadium: 'Stadio del Alpi',
    scores: { home: 0, away: 0 },
    events: [],
    stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } },
  },
  {
    id: '6',
    status: 'finished',
    date: '17/12',
    startTime: '18:00',
    time: 'FT',
    homeTeam: teams.chelsea,
    awayTeam: teams.tottenham,
    league: leagues.faCup,
    stadium: 'Stamford Bridge',
    scores: { home: 2, away: 1 },
    events: [],
    stats: { possession: { home: 65, away: 35 }, shots: { home: 15, away: 6 }, shotsOnGoal: { home: 7, away: 2 }, fouls: { home: 9, away: 12 }, corners: { home: 8, away: 2 }, offsides: { home: 3, away: 1 } },
  },
  {
    id: '7',
    status: 'finished',
    date: '17/12',
    startTime: '21:00',
    time: 'FT',
    homeTeam: teams.arsenal,
    awayTeam: teams.ipswich,
    league: leagues.faCup,
    stadium: 'Emirates Arena',
    scores: { home: 3, away: 1 },
    events: [],
    stats: { possession: { home: 60, away: 40 }, shots: { home: 20, away: 8 }, shotsOnGoal: { home: 10, away: 3 }, fouls: { home: 11, away: 14 }, corners: { home: 9, away: 3 }, offsides: { home: 2, away: 2 } },
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return matches.find((match) => match.id === id);
};
