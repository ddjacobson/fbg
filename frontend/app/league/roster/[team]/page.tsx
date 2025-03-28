"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown, X, Loader2 } from "lucide-react"
import { useLeagueStore } from "@/app/store/leagueStore"
import React from "react"
import Image from "next/image"
import { Player } from "@/app/types/player"
import TeamSelector from "@/app/components/TeamSelector"
import { PlayerDetailsDialog } from "@/app/components/dialogs/PlayerDetailsDialog"
import { getTeamLogo } from "@/app/constants/nfl"

type SortKey = keyof Player

export default function RosterPage({params}: {params: Promise<{team: string}>;}) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const team = React.use(params).team
  const roster = useLeagueStore().roster

  const players = roster.filter((player) => {
    var name = player.teamName.split(" ")
    var teamName = name[name.length - 1].toLowerCase()
    return teamName === team
  });

  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortPlayers = (key: SortKey) => {
    const newSortOrder = key === sortKey && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(newSortOrder)
  }

  const openPlayerDialog = (player: Player) => {
    setSelectedPlayer(player)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center">
        <div className="relative w-[70px] h-[70px] flex items-center justify-center">
          {imageLoading && (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          )}
          <Image 
            src={getTeamLogo(team)}
            alt={`${team} logo`}
            width={70}
            height={70}
          />
        </div>
        <h1 className="mt-4 ml-3 text-3xl font-bold pb-5">Team Roster</h1>
        <div className="justify flex-end ml-auto">
          <TeamSelector/>
        </div>
      </div>

      <div className="mt-3 border rounded-lg overflow-hidden">
        <div className="h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("name")}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("position")}>
                    Position <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("height")}>
                    Height<ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("weight")}>
                    Weight<ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("speedRtg")}>
                    Speed <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.name}>
                  <TableCell>                    
                    <button
                      onClick={() => openPlayerDialog(player)}
                      className="text-left hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
                    >
                     <b> {player.name} </b> 
                    </button>
                  </TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>{player.weight}</TableCell>
                  <TableCell>{player.speedRtg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <PlayerDetailsDialog player={selectedPlayer} team={team} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}