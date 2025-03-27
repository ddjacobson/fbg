"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Add this
import { Team } from "@/app/types/team";
import { League } from "@/app/types/league";
import { Game } from "@/app/types/game";
import { Player } from "@/app/types/player";
import { get } from "http";


type Schedule = {
  [week: number]: [ {gameNum: Game}  ]
};

// Define API URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface LeagueState {
  league: League | null;
  setLeague: (league: League) => void;
  updateLeague: (league: League) => void;
  teams: Team[];
  userTeam: Team | null;
  roster: Player[];
  setTeams: (teams: Team[]) => void;
  setUserTeam: (team: Team) => void;
  schedule: Schedule | null;
  setSchedule: (schedule: Schedule) => void;
  setRoster: (roster: Player[]) => void;

  // getTeam: (teamName: string) => Team | undefined;
  getPlayersByTeam: (teamName: string) => void;
  updateTeamRecord: (teamId: string, wins: number, losses: number) => void;
}

export const useLeagueStore = create<LeagueState>()(
  persist(
  (set, get) => ({
    league: null,
    setLeague: (league) => set({ league }),
    updateLeague: (league) => set({ league }),
    teams: [],
    userTeam: null,
    schedule: null,
    roster: [],
    setTeams: (teams) => set({ teams }),
    setUserTeam: (team) => set({ userTeam: team }),
    setSchedule: (schedule) => set({ schedule: schedule }),
    setRoster: (roster) => set({roster: roster}),

    getPlayersByTeam: (teamName) => {
      const { roster } = get();
      return roster.filter((player) => player.teamName === teamName);
    },

    updateTeamRecord: (teamId, wins, losses) =>
      set((state) => ({
        teams: state.teams.map((team) =>
          team.teamId === teamId ? { ...team, wins, losses } : team
        ),
      })),
    }),
  {
    name: "league-storage", // unique name
    storage: createJSONStorage(() => localStorage), // Correct property name
    
  }
));
