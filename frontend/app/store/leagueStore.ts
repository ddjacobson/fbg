"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Add this
import { Team } from "@/app/types/team";
import { League } from "../types/league";



interface LeagueState {
  league: League | null;
  setLeague: (league: League) => void;
  updateLeague: (league: League) => void;
  teams: Team[];
  userTeam: Team | null;
  setTeams: (teams: Team[]) => void;
  setUserTeam: (team: Team) => void;

  // getTeam: (teamName: string) => Team | undefined;
  updateTeamRecord: (teamId: string, wins: number, losses: number) => void;
}

export const useLeagueStore = create<LeagueState>()(
  persist(
  (set) => ({
  league: null,
  setLeague: (league) => set({ league }),
  updateLeague: (league) => set({ league }),
  teams: [],
  userTeam: null,
  setTeams: (teams) => set({ teams }),
  setUserTeam: (team) => set({ userTeam: team }),

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
