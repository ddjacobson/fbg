"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/app/ui/card"
import { Button } from "@/app/ui/button"
import { ScrollArea } from "@/app/ui/scroll-area"
import Link from "next/link"
import Image from "next/image"
import { useLeagueStore } from "../store/leagueStore"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Team } from "../types/team"
import { getTeamLogo } from "../constants/nfl"

interface Game {
  id: number
  homeTeam: Team
  awayTeam: Team
  homeScore?: number
  awayScore?: number
  weekNo: number
}

interface ScheduleGame {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  weekNo: number
  // Add any other properties that might be in the schedule game object
}

// Augment the LeagueState type to include world property
declare module "../store/leagueStore" {
  interface LeagueState {
    world?: {
      schedule?: ScheduleGame[]
      // Add other world properties as needed
    }
  }
}

export default function Sidebar() {
  const leagueStore = useLeagueStore();
  const currentWeek = leagueStore.league?.week || 1;
  const [viewingWeek, setViewingWeek] = useState(currentWeek);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);  
  
  // Fetch games from localStorage
  useEffect(() => {
    const fetchGamesFromLocalStorage = () => {
      setIsLoading(true);
      try {
        const world = JSON.parse(localStorage.getItem("world") || '{}');
        const leagueSchedule = world.leagueSchedule;
        const weekGames = new Array<Game>();

        if (leagueSchedule && leagueSchedule[viewingWeek]) {
          for (const game of leagueSchedule[viewingWeek]) {
            weekGames.push(game);
          }
        }

        setGames(weekGames);
      } catch (error) {
        console.error("Error fetching games from localStorage:", error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamesFromLocalStorage();
  }, [viewingWeek]);

  const advanceWeek = async () => {
    try {
      const response = await fetch("/api/advance-week", { method: "POST" })
      if (!response.ok) {
        throw new Error("Failed to advance week")
      }
      // Refresh the current page to update with new week
      window.location.reload()
    } catch (error) {
      console.error("Error advancing week:", error)
    }
  }

  const goToPreviousWeek = () => {
    if (viewingWeek > 1) {
      setViewingWeek(viewingWeek - 1)
    }
  }

  const goToNextWeek = () => {
    // Assuming the season has 17 weeks (adjust as needed)
    if (viewingWeek < 17) {
      setViewingWeek(viewingWeek + 1)
    }
  }

  return (
    <aside className="w-60 bg-gray-100 flex flex-col h-full">
      <div className="p-4 flex-grow overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Week {viewingWeek}</h2>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousWeek} 
              disabled={viewingWeek <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextWeek} 
              disabled={viewingWeek >= 17}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="h-px bg-gray-300 w-full my-3"></div>

        {isLoading ? (
          <div className="text-sm text-gray-600">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="text-sm text-gray-600">No games scheduled for this week</div>
        ) : (
          <ScrollArea className="h-[calc(45vh)] ">
            {games.map((game) => (
              <Card key={game.homeTeam.teamId} className="mb-2 border-b">
                <CardContent className="p-2">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="relative w-5 h-5 mr-1 flex-shrink-0">
                          <Image 
                            src={getTeamLogo(game.homeTeam.name)}
                            alt={`${game.homeTeam.name} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Link
                          href={`/league/home/${encodeURIComponent(game.homeTeam.name.toLowerCase())}`}
                          className="font-bold hover:underline text-sm"
                        >
                          {game.homeTeam.name}
                        </Link>
                      </div>
                      <span className="font-bold text-sm">{game.homeScore !== undefined ? game.homeScore : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="relative w-5 h-5 mr-1 flex-shrink-0">
                          <Image 
                            src={getTeamLogo(game.awayTeam.name)}
                            alt={`${game.awayTeam.name} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Link 
                          href={`/league/home/${encodeURIComponent(game.awayTeam.name.toLowerCase())}`} 
                          className="hover:underline text-sm"
                        >
                          {game.awayTeam.name}
                        </Link>
                      </div>
                      <span className="text-sm">{game.awayScore !== undefined ? game.awayScore : '-'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
        
        <div className="h-px bg-gray-300 w-full my-4"></div>
        
      </div>
    
      <div className="flex justify-center px-4 pb-4">
        <Button onClick={advanceWeek} className="w-3/4" size="sm">
          Advance Week
        </Button>
      </div>
      
    </aside>
  )
}

