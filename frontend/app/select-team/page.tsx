"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/ui/dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Team } from "../types/team"
import { League } from "../types/league"
import { useLeagueStore } from "../store/leagueStore"



export default function TeamsPage() {
  const { teams, setTeams, setUserTeam, setLeague } = useLeagueStore();
  const router = useRouter()

  const handleSelectTeam = async (team: Team) => {
    localStorage.setItem("currentTeam", JSON.stringify(team))
    console.log("Selecting team:", team.name)
    
    // Update the league with the selected team
    setUserTeam(team);


    router.push(`/league/home/${team.name.toLowerCase()}`);  
  }
  
  useEffect(() => {
    const storedTeams = localStorage.getItem("teams");
    const leagueResponse = storedTeams ? JSON.parse(storedTeams) : [];

    setTeams(leagueResponse.teams);
    setLeague(leagueResponse.league);

  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">NFL Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Dialog key={team.teamId}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle>{team.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Image src={team.logoUrl || "/placeholder.svg"} alt={`${team.name} logo`} width={100} height={100} />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {team.city} {team.name}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Image
                  src={team.logoUrl || "/placeholder.svg"}
                  alt={`${team.name} logo`}
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
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
                  className="mt-4 w-half bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  onClick={() => handleSelectTeam(team)}
                  >
                  Select the {team.name}
                  </button>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

