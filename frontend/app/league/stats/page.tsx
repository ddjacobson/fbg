"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/select"
import { PassingStats } from "@/app/components/stats/PassingStats"
import { RushingStats } from "@/app/components/stats/RushStats"
import { ReceivingStats } from "@/app/components/stats/RecStats"
import { DefenseStats } from "@/app/components/stats/DefenseStats"

export default function StatsPage() {
  const [selectedCategory, setSelectedCategory] = useState("passing")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Player Statistics</h1>
      <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
        <SelectTrigger className="w-[180px] mb-5">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="passing">Passing</SelectItem>
          <SelectItem value="rushing">Rushing</SelectItem>
          <SelectItem value="receiving">Receiving</SelectItem>
          <SelectItem value="defense">Defense</SelectItem>
        </SelectContent>
      </Select>

      {selectedCategory === "passing" && <PassingStats />}
      {selectedCategory === "rushing" && <RushingStats />}
      {selectedCategory === "receiving" && <ReceivingStats />}
      {selectedCategory === "defense" && <DefenseStats />}
    </div>
  )
}

