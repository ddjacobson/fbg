"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown, X } from "lucide-react"
import { useLeagueStore } from "@/app/store/leagueStore"
import React from "react"
import { Player } from "@/app/types/player"
import TeamSelector from "@/app/components/TeamSelector"
import { PlayerDetailsDialog } from "@/app/components/dialogs/PlayerDetailsDialog"
type SortKey = keyof Player

export default function RosterPage({params}: {params: Promise<{team: string}>;}) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const team = React.use(params).team
  const roster = useLeagueStore().roster
  // console.log("players for " + team + roster)

  const players = roster.filter((player) => {
    var name = player.teamName.split(" ")
    var teamName = name[name.length - 1].toLowerCase()
    console.log(team == teamName)
    return teamName === team
  });
  console.log(players)
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortPlayers = (key: SortKey) => {
    const newSortOrder = key === sortKey && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(newSortOrder)

    // const sortedPlayers = [...players].sort((a, b) => {
    //   if (a?[key] < b?[key]) return sortOrder === "asc" ? -1 : 1
    //   if (a?[key] > b?[key]) return sortOrder === "asc" ? 1 : -1
    //   return 0
    // })

    // setPlayers(sortedPlayers)



  }

  const openPlayerDialog = (player: Player) => {
    setSelectedPlayer(player)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Team Roster</h1>
      <TeamSelector/>

      <div className="border rounded-lg overflow-hidden">

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
                  <TableCell>                    <button
                      onClick={() => openPlayerDialog(player)}
                      className="text-left hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
                    >
                      {player.name}
                    </button></TableCell>
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

