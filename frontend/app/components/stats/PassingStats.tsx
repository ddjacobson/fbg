"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown } from "lucide-react"

interface PassingStatsData {
  id: number
  name: string
  completions: number
  attempts: number
  passYards: number
}

const initialPassingStats: PassingStatsData[] = [
  { id: 1, name: "Tom Brady", completions: 401, attempts: 610, passYards: 4694 },
  { id: 2, name: "Patrick Mahomes", completions: 383, attempts: 584, passYards: 4740 },
  { id: 3, name: "Josh Allen", completions: 359, attempts: 544, passYards: 4283 },
  // Add more QB stats as needed
]

type SortKey = keyof PassingStatsData

export function PassingStats() {
  const [stats, setStats] = useState<PassingStatsData[]>(initialPassingStats)
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
                <Button variant="ghost" onClick={() => sortStats("completions")}>
                  Completions <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("attempts")}>
                  Attempts <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("passYards")}>
                  Pass Yards <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.completions}</TableCell>
                <TableCell>{stat.attempts}</TableCell>
                <TableCell>{stat.passYards}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

