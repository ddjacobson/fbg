"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/table"
import { Button } from "@/app/ui/button"
import { ArrowUpDown } from "lucide-react"

interface ReceivingStatsData {
  id: number
  name: string
  receptions: number
  recYards: number
  recTD: number
  targets: number
}

const initialReceivingStats: ReceivingStatsData[] = [
  { id: 1, name: "Cooper Kupp", receptions: 145, recYards: 1947, recTD: 16, targets: 191 },
  { id: 2, name: "Justin Jefferson", receptions: 108, recYards: 1616, recTD: 10, targets: 167 },
  { id: 3, name: "Davante Adams", receptions: 123, recYards: 1553, recTD: 11, targets: 169 },
  // Add more WR/TE stats as needed
]

type SortKey = keyof ReceivingStatsData

export function ReceivingStats() {
  const [stats, setStats] = useState<ReceivingStatsData[]>(initialReceivingStats)
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
                <Button variant="ghost" onClick={() => sortStats("receptions")}>
                  Receptions <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("recYards")}>
                  Rec Yards <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("recTD")}>
                  Rec TD <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortStats("targets")}>
                  Targets <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.receptions}</TableCell>
                <TableCell>{stat.recYards}</TableCell>
                <TableCell>{stat.recTD}</TableCell>
                <TableCell>{stat.targets}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

