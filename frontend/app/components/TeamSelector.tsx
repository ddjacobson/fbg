"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/select"
import { ScrollArea } from "@/app/ui/scroll-area"
import Image from "next/image"
import { getTeamLogo } from "@/app/constants/nfl"

export default function TeamSelector() {
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState("")

  // NFL teams with their display names and URL slugs
  const nflTeams = [
    { name: "Arizona Cardinals", slug: "cardinals" },
    { name: "Atlanta Falcons", slug: "falcons" },
    { name: "Baltimore Ravens", slug: "ravens" },
    { name: "Buffalo Bills", slug: "bills" },
    { name: "Carolina Panthers", slug: "panthers" },
    { name: "Chicago Bears", slug: "bears" },
    { name: "Cincinnati Bengals", slug: "bengals" },
    { name: "Cleveland Browns", slug: "browns" },
    { name: "Dallas Cowboys", slug: "cowboys" },
    { name: "Denver Broncos", slug: "broncos" },
    { name: "Detroit Lions", slug: "lions" },
    { name: "Green Bay Packers", slug: "packers" },
    { name: "Houston Texans", slug: "texans" },
    { name: "Indianapolis Colts", slug: "colts" },
    { name: "Jacksonville Jaguars", slug: "jaguars" },
    { name: "Kansas City Chiefs", slug: "chiefs" },
    { name: "Las Vegas Raiders", slug: "raiders" },
    { name: "Los Angeles Chargers", slug: "chargers" },
    { name: "Los Angeles Rams", slug: "rams" },
    { name: "Miami Dolphins", slug: "dolphins" },
    { name: "Minnesota Vikings", slug: "vikings" },
    { name: "New England Patriots", slug: "patriots" },
    { name: "New Orleans Saints", slug: "saints" },
    { name: "New York Giants", slug: "giants" },
    { name: "New York Jets", slug: "jets" },
    { name: "Philadelphia Eagles", slug: "eagles" },
    { name: "Pittsburgh Steelers", slug: "steelers" },
    { name: "San Francisco 49ers", slug: "49ers" },
    { name: "Seattle Seahawks", slug: "seahawks" },
    { name: "Tampa Bay Buccaneers", slug: "buccaneers" },
    { name: "Tennessee Titans", slug: "titans" },
    { name: "Washington Commanders", slug: "commanders" },
  ]

  // can adapt to positions

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value)
    router.push(`/league/roster/${value}`)
  }

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={handleTeamChange} value={selectedTeam}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-72 rounded-md">
            {nflTeams.map((team) => (
              <SelectItem key={team.slug} value={team.slug}>
                <div className="flex items-center gap-2">
                  <Image
                    src={getTeamLogo(team.slug)}
                    alt={`${team.name} logo`}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                  <span>{team.name}</span>
                </div>
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  )
}

