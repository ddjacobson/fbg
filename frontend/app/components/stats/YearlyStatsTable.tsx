"use client"

import { Player } from "@/app/types/player"
import { ScrollArea } from "@/app/ui/scroll-area"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"

interface YearlyStatsTableProps {
  player: Player
}

type StatYear = {
  year: string
  team: string
  games: number
  starts: number
  passYds?: number
  rushYds?: number
  recYds?: number
  tds: number
}

export function YearlyStatsTable({ player }: YearlyStatsTableProps) {
  const [sortKey, setSortKey] = useState<keyof StatYear>('year')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const stats: StatYear[] = [
    {
      year: '2024',
      team: player.teamName,
      games: 16,
      starts: 12,
      passYds: player.position === 'QB' ? 3245 : undefined,
      rushYds: player.position === 'HB' ? 1102 : undefined,
      recYds: player.position === 'WR' ? 1245 : undefined,
      tds: 12
    },
    {
      year: '2023',
      team: player.teamName,
      games: 14,
      starts: 8,
      passYds: player.position === 'QB' ? 2845 : undefined,
      rushYds: player.position === 'HB' ? 890 : undefined,
      recYds: player.position === 'WR' ? 1102 : undefined,
      tds: 8
    },
    {
      year: '2022',
      team: player.college || '',
      games: 12,
      starts: 10,
      passYds: player.position === 'QB' ? 3102 : undefined,
      rushYds: player.position === 'HB' ? 1245 : undefined,
      recYds: player.position === 'WR' ? 1102 : undefined,
      tds: 14
    }
  ]

  const handleSort = (key: keyof StatYear) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const sortedStats = [...stats].sort((a, b) => {
    const aValue = a[sortKey]
    const bValue = b[sortKey]
    
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
  return (
    <ScrollArea className="h-[300px] col-span-3">
      <h3 className="text-xl font-bold mb-3 sticky top-0 bg-white pb-1">Yearly Stats</h3>
      <div className="bg-gray-50 rounded-lg p-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2">Year</th>
              <th className="text-left pb-2">Team</th>
              <th className="text-right pb-2">Games</th>
              <th className="text-right pb-2">Starts</th>
              {player.position === 'QB' && <th className="text-right pb-2">Pass Yds</th>}
              {player.position === 'HB' && <th className="text-right pb-2">Rush Yds</th>}
              {player.position === 'WR' && <th className="text-right pb-2">Rec Yds</th>}
              <th className="text-right pb-2">TDs</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">2024</td>
              <td>{player.teamName}</td>
              <td className="text-right">16</td>
              <td className="text-right">12</td>
              {player.position === 'QB' && <td className="text-right">3,245</td>}
              {player.position === 'HB' && <td className="text-right">1,102</td>}
              {player.position === 'WR' && <td className="text-right">1,245</td>}
              <td className="text-right">12</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">2023</td>
              <td>{player.teamName}</td>
              <td className="text-right">14</td>
              <td className="text-right">8</td>
              {player.position === 'QB' && <td className="text-right">2,845</td>}
              {player.position === 'RB' && <td className="text-right">890</td>}
              {player.position === 'WR' && <td className="text-right">1,102</td>}
              <td className="text-right">8</td>
            </tr>
            <tr>
              <td className="py-2">2022</td>
              <td>{player.college}</td>
              <td className="text-right">12</td>
              <td className="text-right">10</td>
              {player.position === 'QB' && <td className="text-right">3,102</td>}
              {player.position === 'HB' && <td className="text-right">1,245</td>}
              {player.position === 'WR' && <td className="text-right">1,102</td>}
              <td className="text-right">14</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ScrollArea>
  )
}