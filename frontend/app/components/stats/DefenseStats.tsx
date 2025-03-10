"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown } from "lucide-react"

interface DefenseStatsData {
  id: number
  name: string
  position: string
  tackles: number
  sacks: number
  tfl: number
  interceptions: number
  td: number
}

const initialDefenseStats: DefenseStatsData[] = [
  { id: 1, name: "T.J. Watt", position: "OLB", tackles: 64, sacks: 22.5, tfl: 21, interceptions: 1, td: 0 },
  { id: 2, name: "Aaron Donald", position: "DT", tackles: 84, sacks: 12.5, tfl: 19, interceptions: 0, td: 0 },
  { id: 3, name: "Trevon Diggs", position: "CB", tackles: 52, sacks: 0, tfl: 3, interceptions: 11, td: 2 },
  // Add more defensive player stats as needed
]

type SortKey = keyof DefenseStatsData

export function DefenseStats() {
  const [stats, setStats] = useState<DefenseStatsData[]>(initialDefenseStats)
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortStats = (key: SortKey) => {
    const newSortOrder = key === sortKey && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(newSortOrder)

    const sortedStats = [...stats].sort((a, b) => {
      if (a[key] < b[key]) return sortOrder === "asc" ? -1 : 1
      if (a[key] > b[key]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setStats(sortedStats)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="h-[600px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("name")}>
                  Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("position")}>
                  Position <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("tackles")}>
                  Tackles <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("sacks")}>
                  Sacks <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("tfl")}>
                  TFL <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("interceptions")}>
                  Interceptions <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("td")}>
                  TD <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.position}</TableCell>
                <TableCell>{stat.tackles}</TableCell>
                <TableCell>{stat.sacks}</TableCell>
                <TableCell>{stat.tfl}</TableCell>
                <TableCell>{stat.interceptions}</TableCell>
                <TableCell>{stat.td}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

