"use client"

import { useEffect, useState } from "react"
import { ScrollArea, ScrollBar } from "@/app/ui/scroll-area"
import { Card, CardContent } from "@/app/ui/card"
import { Game } from "../types/game"
import Image from "next/image"
import { getTeamLogo } from "../constants/nfl"
import { useRouter } from "next/navigation"

interface TeamScheduleProps {
  teamName: string
}

// Helper component to conditionally bold team names and show score
const TeamName = ({ 
  name, 
  currentTeam,
  score
}: { 
  name: string; 
  currentTeam: string;
  score?: number | null;
}) => {
  const isCurrentTeam = name.toLowerCase() === currentTeam.toLowerCase();
  const router = useRouter();
  
  // Get the team logo URL from the NFL constants
  // The name in the game data might include city name, just the team name
  const teamNameOnly = name.split(" ").pop() || name;
  const logoUrl = getTeamLogo(teamNameOnly);
  
  // Navigate to team page when team name is clicked
  const handleTeamClick = () => {
    // Create a URL-friendly version of the team name
    const teamSlug = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/league/home/${teamSlug}`);
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:underline" 
        onClick={handleTeamClick}
        title={`View ${name} details`}
      >
        <div className="relative w-6 h-6">
          <Image 
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className="object-contain"
          />
        </div>
        {isCurrentTeam ? <strong>{name}</strong> : <>{name}</>}
      </div>
      <div className="text-sm font-semibold">
        {score !== undefined && score !== null ? score : '-'}
      </div>
    </div>
  );
};

export function TeamSchedule({ teamName }: TeamScheduleProps) {
  // fetch team's schedule in useEffect, update when week changes?

      const world = JSON.parse(localStorage.getItem("world") || '{}');
  
      const leagueSchedule = world.leagueSchedule;
      const games = new Array<Game>();
  
      for (const key in leagueSchedule) {  
          for (const game of leagueSchedule[key]) {
              if (game.awayTeam.name.toLowerCase() === teamName.toLowerCase() || game.homeTeam.name.toLowerCase() === teamName.toLowerCase()) {
                games.push(game)
              }   
          }
      }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {games.map((game) => {
          // Safely check for game properties
          const isCompleted = (game as any).completed === true;
          const awayScore = isCompleted ? (game as any).awayScore : null;
          const homeScore = isCompleted ? (game as any).homeScore : null;
          
          return (
            <Card key={game.week} className="w-[150px]">
              <CardContent className="p-3">
                <h3 className="font-semibold">Week {game.week}</h3>

                <p className="w-full">
                  <TeamName 
                    name={game.awayTeam.name} 
                    currentTeam={teamName}
                    score={awayScore}
                  />
                </p>
                
                <p className="w-full">
                  <TeamName 
                    name={game.homeTeam.name} 
                    currentTeam={teamName} 
                    score={homeScore}
                  />
                </p>

                {/* Game status */}
                {isCompleted ? (
                  <p className="text-xs text-center mt-2 text-green-600">Final</p>
                ) : (
                  <p className="text-xs text-center mt-2 text-gray-500">Upcoming</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}