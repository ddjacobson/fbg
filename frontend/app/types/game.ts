import { Team } from './team';

export interface Game {
  gameId?: string;
  leagueId?: string;
  homeTeam: Team;
  awayTeam: Team;
  week: number;
  year?: number;
  // Add any other properties your Game model has in the backend
  // For example, score information:
  homeScore?: number;
  awayScore?: number;
  isCompleted?: boolean;
} 