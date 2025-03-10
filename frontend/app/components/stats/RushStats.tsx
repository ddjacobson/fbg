"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown } from "lucide-react"

interface RushingStatsData {
  id: number
  name: string
  rushAttempts: number
  rushYards: number
  rushTD: number
}

const initialRushingStats: RushingStatsData[] = [
  { id: 1, name: "Derrick Henry", rushAttempts: 303, rushYards: 1538, rushTD: 13 },
  { id: 2, name: "Jonathan Taylor", rushAttempts: 332, rushYards: 1811, rushTD: 18 },
  { id: 3, name: "Nick Chubb", rushAttempts: 228, rushYards: 1259, rushTD: 8 },
  // Add more RB stats as needed
]

type SortKey = keyof RushingStatsData

export function RushingStats() {
  const [stats, setStats] = useState<RushingStatsData[]>(initialRushingStats)
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
                <Button variant="ghost" onClick={() => sortStats("rushAttempts")}>
                  Rush Attempts <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("rushYards")}>
                  Rush Yards <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("rushTD")}>
                  Rush TD <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.rushAttempts}</TableCell>
                <TableCell>{stat.rushYards}</TableCell>
                <TableCell>{stat.rushTD}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

