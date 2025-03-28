"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/ui/dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Team } from "../types/team"
import { League } from "../types/league"
import { useLeagueStore } from "../store/leagueStore"
import { NFL_LOGOS, NFL_COLORS, NFL_LEAGUE_LOGO, getTeamColor, getTeamLogo, getTeamStadium } from "../constants/nfl"

export default function TeamsPage() {
  const { teams, setTeams, setUserTeam, setLeague, setSchedule } = useLeagueStore();
  const router = useRouter()

  const handleSelectTeam = async (team: Team) => {
    localStorage.setItem("currentTeam", JSON.stringify(team))
    console.log("Selecting team:", team.name)
    
    // Update the league with the selected team
    setUserTeam(team);

    const response = await fetch("http://localhost:8080/set-user-team", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId: team.teamId,}),
    })

    if (response.ok) {
      router.push(`/league/home/${team.name.toLowerCase()}`);  
    }
  }
  
  useEffect(() => {
    const storedTeams = localStorage.getItem("world");
    const leagueResponse = storedTeams ? JSON.parse(storedTeams) : [];
    setTeams(leagueResponse.teams);
    setLeague(leagueResponse.league);
    setSchedule(leagueResponse.schedule)

  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">NFL Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Dialog key={team.teamId}>
            <DialogTrigger asChild>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow max-w-xs group overflow-hidden"
              >
                <div className="flex items-center p-4 relative">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: getTeamColor(team.name) }}
                  ></div>
                  <div className="flex-shrink-0 mr-4 relative z-10">
                    <Image 
                      src={getTeamLogo(team.name)} 
                      alt={`${team.name} logo`} 
                      width={60} 
                      height={60} 
                    />
                  </div>
                  <div className="relative">
                    {/* Static team name that fades out */}
                    <span className="text-lg block transition-opacity duration-300 group-hover:opacity-0">
                      {team.name}
                    </span>
                    
                    {/* Colored team name that fades in */}
                    <span 
                      className="text-lg font-bold absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse"
                      style={{ color: getTeamColor(team.name) }}
                    >
                      {team.name}
                    </span>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
              <DialogHeader className="flex flex-col items-center">
                <div className="flex items-center justify-center space-x-3 w-full">
                  <Image 
                    src={getTeamLogo(team.name)}
                    alt={`${team.name} logo`}
                    width={40}
                    height={40}
                  />
                  <DialogTitle>
                    {team.city} {team.name}
                  </DialogTitle>
                  <div className="text-gray-500">
                    (0-0)
                  </div>
                </div>
              </DialogHeader>
              <div className="mt-4 relative">
                {/* City skyline background */}
                <div className="absolute inset-0 w-full h-64 overflow-hidden rounded-lg mb-6 -z-10">
                  <Image
                    src={getTeamStadium(team.name)}
                    alt={`${team.city} skyline`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="opacity-90"
                    priority
                  />
                </div>
                
                {/* Team logo above the city skyline */}
                <div className="pt-4 relative z-10">
                  <Image
                    src={getTeamLogo(team.name)}
                    alt={`${team.name} logo`}
                    width={150}
                    height={150}
                    className="mx-auto mb-4 bg-white/40 p-2 rounded-full"
                    priority
                  />
                </div>
                
                {/* Team information */}
                <div className="pt-20 relative z-10 mt-2 p-4 rounded-md">
                  <p>
                    <strong>City:</strong> {team.city}
                  </p>
                  <p>
                    <strong>Name:</strong> {team.name}
                  </p>
                  <p>
                    <strong>Division:</strong> {team.division}
                  </p>
                  <p>
                    <strong>Conference:</strong> {team.conf}
                  </p>
          
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="mt-4 w-half text-white py-1 px-3 rounded-md transition-colors duration-300 focus:outline-none"
                      style={{ 
                        backgroundColor: getTeamColor(team.name),
                      }}
                      // Add hover effect via inline function
                      onMouseOver={(e) => {
                        e.currentTarget.style.filter = "brightness(85%)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.filter = "brightness(100%)";
                      }}
                      onClick={() => handleSelectTeam(team)}
                    >
                      Select the {team.name}
                    </button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

