"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown } from "lucide-react"

interface Player {
  id: number
  name: string
  position: string
  height: number
  weight: number
  speed: number
}

const initialPlayers: Player[] = [
  { id: 1, name: "John Doe", position: "QB", height: 75, weight: 220, speed: 4.6 },
  { id: 2, name: "Mike Smith", position: "RB", height: 70, weight: 200, speed: 4.4 },
  { id: 3, name: "Tom Johnson", position: "WR", height: 73, weight: 190, speed: 4.3 },
  // Add more players as needed
]

type SortKey = keyof Player

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortPlayers = (key: SortKey) => {
    const newSortOrder = key === sortKey && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(newSortOrder)

    const sortedPlayers = [...players].sort((a, b) => {
      if (a[key] < b[key]) return sortOrder === "asc" ? -1 : 1
      if (a[key] > b[key]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setPlayers(sortedPlayers)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Team Roster</h1>
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
                    Height (in) <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("weight")}>
                    Weight (lbs) <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortPlayers("speed")}>
                    Speed (40yd) <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>{player.weight}</TableCell>
                  <TableCell>{player.speed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

