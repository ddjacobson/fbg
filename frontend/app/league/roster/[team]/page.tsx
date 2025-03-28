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
import { inchesToFeet } from "@/app/lib/utils"

type SortKey = keyof Player

export default function RosterPage({params}: {params: Promise<{team: string}>;}) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const team = React.use(params).team
  const roster = useLeagueStore().roster
  const [sortKey, setSortKey] = useState<SortKey>("overall")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const players = roster
    .filter((player) => {
      var name = player.teamName.split(" ")
      var teamName = name[name.length - 1].toLowerCase()
      return teamName === team
    })
    .sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }
      
      return 0
    });

  const sortPlayers = (key: SortKey) => {
    const newSortOrder = key === sortKey && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(newSortOrder)
  }

  const openPlayerDialog = (player: Player) => {
    setSelectedPlayer(player)
    setDialogOpen(true)
  }

  const releasePlayer = (playerId: string) => {
    console.log(`Releasing player ${playerId}`)
    // TODO: Implement backend integration
    alert(`Player ${playerId} released (mock)`)
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
                <TableHead className="w-[50px] px-2">
                  <Button variant="ghost" onClick={() => sortPlayers("jerseyNo")} className="px-0">
                    # <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="px-2">
                  <Button variant="ghost" onClick={() => sortPlayers("name")} className="px-0">
                    Name <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="px-2">
                  <Button variant="ghost" onClick={() => sortPlayers("position")} className="px-0">
                    Position <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="px-2">
                  <Button variant="ghost" onClick={() => sortPlayers("height")} className="px-0">
                    Height <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="px-2">
                  <Button variant="ghost" onClick={() => sortPlayers("weight")} className="px-0">
                    Weight <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="px-2">
                  <Button variant="ghost" onClick={() => sortPlayers("speedRtg")} className="px-0">
                    Speed <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.name}>
                  <TableCell className="px-2 py-1">#{player.jerseyNo || "-"}</TableCell>
                  <TableCell className="px-2 py-1">
                    <div className="flex items-center gap-2 h-full">
                    <button
                        onClick={() => releasePlayer(player.playerId || '')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Release player"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openPlayerDialog(player)}
                        className="text-left hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      >
                        <b>{player.name}</b>
                      </button>

                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2">{player.position}</TableCell>
                  <TableCell className="px-2 py-2">{player.height ? inchesToFeet(player.height) : "-"}</TableCell>
                  <TableCell className="px-2 py-2">{player.weight}</TableCell>
                  <TableCell className="px-2 py-2">{player.speedRtg}</TableCell>
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