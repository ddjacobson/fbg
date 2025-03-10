"use client"

import { useEffect, useState } from "react"
import { ScrollArea, ScrollBar } from "@/app/ui/scroll-area"
import { Card, CardContent } from "@/app/ui/card"

interface Game {
  week: number
  opponent: string
  isHome: boolean
  result?: "W" | "L" | "T"
  score?: string
}

interface TeamScheduleProps {
  teamName: string
}

export function TeamSchedule({ teamName }: TeamScheduleProps) {
  const [games, setGames] = useState<Game[]>([])
  console.log("TeamSchedule teamId:", teamName)

  // fetch team's schedule in useEffect, update when week changes?



  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {games.map((game) => (
          <Card key={game.week} className="w-[150px]">
            <CardContent className="p-3">
              <h3 className="font-semibold">Week {game.week}</h3>
              <p>{game.opponent}</p>
              <p>{game.isHome ? "Home" : "Away"}</p>
              {game.result && (
                <p>
                  {game.result} {game.score}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}