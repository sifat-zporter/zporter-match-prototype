
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
  nationality?: string;
  year?: number;
  number?: number;
  position?: string;
  goals?: number;
  assists?: number;
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

export type TeamForm = 'W' | 'D' | 'L';

export type PastMeeting = {
    id: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    league: string;
    stadium: string;
}

export type Standings = {
    team: Team;
    pld: number;
    gd: number;
    pts: number;
}

export type Match = {
  id: string;
  status: 'scheduled' | 'live' | 'finished';
  date: string;
  fullDate: string;
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
  round?: string;
  isPenalty?: boolean;
  penalties?: { home: number, away: number };
  isLiveStreamed?: boolean;
  teamForm?: {
      home: TeamForm[];
      away: TeamForm[];
  };
  pastMeetings?: PastMeeting[];
  topGoalscorers?: {
      home: Player[];
      away: Player[];
  };
  topAssists?: {
      home: Player[];
      away: Player[];
  };
  averageStats?: {
      goals: { home: number; away: number };
      goalsLetIn: { home: number; away: number };
      netScore: { home: number; away: number };
      points: { home: number; away: number };
      age: { home: number; away: number };
      weight: { home: number; away: number };
      height: { home: number; away: number };
      starReviews: { home: number; away: number };
  };
  standings?: Standings[];
};

export type Cup = {
    id: string;
    name: string;
    logoUrl: string;
    metadata: string;
    matches: Match[];
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
  aikFFU16: { id: 'aikFFU16', name: 'AIK FF-U16', logoUrl: 'https://placehold.co/40x40.png' },
  bpDFFU16: { id: 'bpDFFU16', name: 'BP DFF-U16', logoUrl: 'https://placehold.co/40x40.png' },
  djurgardensIF07A: { id: 'djurgardensIF07A', name: "Djurgårdens IF 07A", logoUrl: 'https://placehold.co/40x40.png' },
  aikFFSvart: { id: 'aikFFSvart', name: 'AIK FF-Svart', logoUrl: 'https://placehold.co/40x40.png' },
  borasGIF: { id: 'borasGIF', name: 'Borås GIF', logoUrl: 'https://placehold.co/40x40.png' },
  manchesterCity: { id: 'manchesterCity', name: 'Manchester City', logoUrl: 'https://placehold.co/40x40.png' },
  bayernMunchen: { id: 'bayernMunchen', name: 'Bayern Munchen', logoUrl: 'https://placehold.co/40x40.png' },
  sevilla: { id: 'sevilla', name: 'Sevilla', logoUrl: 'https://placehold.co/40x40.png' },
  ifBrommapojkarna: { id: 'ifBrommapojkarna', name: 'IF Brommapojkarna - U15', logoUrl: 'https://placehold.co/40x40.png' },

};

const leagues: Record<string, League> = {
  u19Cup: { id: 'u19Cup', name: 'U-19 Cup', logoUrl: 'https://placehold.co/24x24.png' },
  u17Liga: { id: 'u17Liga', name: 'U17 Liga, R-3', logoUrl: 'https://placehold.co/24x24.png' },
  laLiga: { id: 'laLiga', name: 'La Liga, R-17', logoUrl: 'https://placehold.co/24x24.png' },
  premierLeague: { id: 'premierLeague', name: 'Premier League, R-19', logoUrl: 'https://placehold.co/24x24.png' },
  serieA: { id: 'serieA', name: 'Serie A, R-13', logoUrl: 'https://placehold.co/24x24.png' },
  faCup: { id: 'faCup', name: 'FA Cup, R-5', logoUrl: 'https://placehold.co/24x24.png' },
  zporterCup: { id: 'zporterCup', name: 'Zporter Cup 2021, A, Omg. 1', logoUrl: 'https://placehold.co/24x24.png' },
  luxcuper: { id: 'luxcuper', name: 'Luxcuper', logoUrl: 'https://placehold.co/24x24.png' },
  championsLeague: { id: 'championsLeague', name: 'Champions League', logoUrl: 'https://placehold.co/24x24.png' },
};

const players: Record<string, Player> = {
  neoJonsson: { id: 'neoJonsson', name: 'Neo Jönsson', avatarUrl: 'https://placehold.co/40x40.png' },
  philipPawlowski: { id: 'philipPawlowski', name: 'Philip Pawlowski', avatarUrl: 'https://placehold.co/40x40.png' },
  erlingHaaland: { id: 'erlingHaaland', name: 'Erling Haaland', avatarUrl: 'https://placehold.co/40x40.png' },
  kylianMbappe: { id: 'kylianMbappe', name: 'Kylian Mbappé', avatarUrl: 'https://placehold.co/40x40.png' },
  tiamNobari: { id: 'tiamNobari1', name: 'Tiam Nobari', avatarUrl: 'https://placehold.co/40x40.png', nationality: 'SE', year: 2007, number: 10, position: 'FW' },
  tiamNobari2: { id: 'tiamNobari2', name: 'Tiam Nobari', avatarUrl: 'https://placehold.co/40x40.png', nationality: 'SE', year: 2007, number: 11, position: 'S' },
  tiamNobari3: { id: 'tiamNobari3', name: 'Tiam Nobari', avatarUrl: 'https://placehold.co/40x40.png', nationality: 'SE', year: 2007, number: 8, position: 'CM' },
};


export const matches: Match[] = [
  {
    id: '1',
    status: 'live',
    date: '17/12',
    fullDate: '2022-12-17T10:00:00',
    startTime: '10:00',
    time: "68'",
    homeTeam: teams.majFC,
    awayTeam: teams.fcBarcelona,
    league: leagues.zporterCup,
    stadium: 'Stockholm, Sollentuna, Norrvikens IP',
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
    featuredPlayers: [players.neoJonsson],
    teamForm: {
        home: ['L', 'D', 'W', 'W', 'W'],
        away: ['L', 'D', 'W', 'W', 'W'],
    },
    pastMeetings: [
        { id: 'pm1', date: '31/1/2021', homeTeam: 'Maj FC', awayTeam: 'FC Barcelona', homeScore: 12, awayScore: 1, league: 'La Liga', stadium: 'Norrvikens IP' },
        { id: 'pm2', date: '31/1/2021', homeTeam: 'FC Barcelona', awayTeam: 'Maj FC', homeScore: 2, awayScore: 2, league: 'La Liga', stadium: 'Norrvikens IP' },
        { id: 'pm3', date: '31/1/2021', homeTeam: 'Maj FC', awayTeam: 'FC Barcelona', homeScore: 1, awayScore: 1, league: 'La Liga', stadium: 'Norrvikens IP' },
        { id: 'pm4', date: '31/1/2021', homeTeam: 'FC Barcelona', awayTeam: 'Maj FC', homeScore: 2, awayScore: 2, league: 'La Liga', stadium: 'Norrvikens IP' },
        { id: 'pm5', date: '31/1/2021', homeTeam: 'Maj FC', awayTeam: 'FC Barcelona', homeScore: 2, awayScore: 1, league: 'La Liga', stadium: 'Norrvikens IP' },
    ],
    topGoalscorers: {
        home: [players.tiamNobari, players.tiamNobari2, players.tiamNobari3],
        away: [players.tiamNobari, players.tiamNobari2, players.tiamNobari3]
    },
    topAssists: {
        home: [players.tiamNobari, players.tiamNobari2, players.tiamNobari3],
        away: [players.tiamNobari, players.tiamNobari2, players.tiamNobari3]
    },
    averageStats: {
        goals: { home: 2.1, away: 1.8 },
        goalsLetIn: { home: 1.1, away: 0.8 },
        netScore: { home: 1.1, away: 0.8 },
        points: { home: 2.1, away: 1.8 },
        age: { home: 14.8, away: 14.3 },
        weight: { home: 52, away: 46 },
        height: { home: 169, away: 167 },
        starReviews: { home: 3.4, away: 3.6 },
    },
    standings: [
        { team: teams.majFC, pld: 3, gd: 1, pts: 6 },
        { team: teams.fcBarcelona, pld: 3, gd: 0, pts: 4 },
        { team: teams.fcCopenhagen, pld: 3, gd: -2, pts: 1 },
        { team: teams.ifBrommapojkarna, pld: 3, gd: -5, pts: 0 },
    ]
  },
  {
    id: '2',
    status: 'live',
    date: '17/12',
    fullDate: '2022-12-17T11:00:00',
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
    fullDate: '2022-12-17T14:00:00',
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
    fullDate: '2022-12-17T16:00:00',
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
    fullDate: '2022-12-17T16:00:00',
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
    fullDate: '2022-12-17T18:00:00',
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
    fullDate: '2022-12-17T21:00:00',
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

export const cups: Cup[] = [
    {
        id: 'zporter-cup-2023',
        name: 'Zporter Cup 2023',
        logoUrl: 'https://placehold.co/24x24.png',
        metadata: 'SE, Male, 2007, Elite, A',
        matches: [
            { id: 'cup-1-1', status: 'finished', date: '16/12', fullDate: '2022-12-16T10:00:00', startTime: '10:00', time: 'FT', homeTeam: teams.majFC, awayTeam: teams.aikFFU16, league: leagues.zporterCup, stadium: 'Norrvikens IP, 1', scores: { home: 1, away: 0 }, round: 'R-1', events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } },
            { id: 'cup-1-2', status: 'finished', date: '16/12', fullDate: '2022-12-16T10:00:00', startTime: '10:00', time: 'FT', homeTeam: teams.majFC, awayTeam: teams.aikFFU16, league: leagues.zporterCup, stadium: 'Norrvikens IP, 1', scores: { home: 3, away: 2 }, round: 'R-1', events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } }
        ]
    },
    {
        id: 'luxcuper-p2007',
        name: 'Luxcuper P2007 Inv.',
        logoUrl: 'https://placehold.co/24x24.png',
        metadata: 'SE, Male, 2007',
        matches: [
            { id: 'cup-2-1', status: 'finished', date: '16/12', fullDate: '2022-12-16T10:00:00', startTime: '10:00', time: 'FT', homeTeam: teams.bpDFFU16, awayTeam: teams.borasGIF, league: leagues.luxcuper, stadium: 'Kristinehamns Arena', scores: { home: 1, away: 0 }, round: '1/2-Final', isLiveStreamed: true, events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } },
            { id: 'cup-2-2', status: 'finished', date: '16/12', fullDate: '2022-12-16T10:00:00', startTime: '10:00', time: 'FT', homeTeam: teams.djurgardensIF07A, awayTeam: teams.aikFFSvart, league: leagues.luxcuper, stadium: 'Kristinehamns Arena', scores: { home: 1, away: 1 }, penalties: {home: 3, away: 4}, round: '1/2-Final', isLiveStreamed: true, events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } },
            { id: 'cup-2-3', status: 'finished', date: '16/12', fullDate: '2022-12-16T16:00:00', startTime: '16:00', time: 'FT', homeTeam: teams.bpDFFU16, awayTeam: teams.aikFFSvart, league: leagues.luxcuper, stadium: 'Kristinehamns Arena', scores: { home: 3, away: 0 }, round: 'Final', isLiveStreamed: true, events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } }
        ]
    },
    {
        id: 'champions-league',
        name: 'Champions League',
        logoUrl: 'https://placehold.co/24x24.png',
        metadata: 'UEFA, Male, Adults',
        matches: [
             { id: 'cup-3-1', status: 'finished', date: '16/12', fullDate: '2022-12-16T21:00:00', startTime: '21:00', time: 'FT', homeTeam: teams.manchesterCity, awayTeam: teams.bayernMunchen, league: leagues.championsLeague, stadium: 'Etihad Stadium', scores: { home: 1, away: 1 }, round: '23/24, Round-2', events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } },
             { id: 'cup-3-2', status: 'finished', date: '16/12', fullDate: '2022-12-16T21:00:00', startTime: '21:00', time: 'FT', homeTeam: teams.sevilla, awayTeam: teams.fcCopenhagen, league: leagues.championsLeague, stadium: 'Mestalla', scores: { home: 1, away: 3 }, round: '23/24, Round-2', events: [], stats: { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnGoal: { home: 0, away: 0 }, fouls: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 } } },
        ]
    }
]

export const getMatchById = (id: string): Match | undefined => {
  const allMatches = [...matches, ...cups.flatMap(c => c.matches)];
  return allMatches.find((match) => match.id === id);
};
