"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/app/ui/card"
import { Button } from "@/app/ui/button"
import { ScrollArea } from "@/app/ui/scroll-area"
import Link from "next/link"
import { useLeagueStore } from "../store/leagueStore"

interface Score {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
}

export default function Sidebar() {

  // games collection will have [leagueId, weekNo, homeTeam, awayTeam, homeScore, awayScore]

  const weekNo = useLeagueStore().league?.week
  console.log("week " + weekNo)
  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(true)



  // fetch all games for the LAST WEEK and put them in the sidebar... if week 1, show week 1 games

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch("http://localhost:8080/scores", {
          method: "GET",
          // mode: "no-cors", // Set mode to 'no-cors'
        });
        if (!response.ok) {
          return <div>No scores</div>;
        }
        const data = await response.json()
        setScores(data)
      } catch (error) {
        console.error("Error fetching scores:", error)

      } finally {
        setIsLoading(false)
      }
    }

    fetchScores()
  }, [])

  const advanceWeek = async () => {
    try {
      const response = await fetch("/api/advance-week", { method: "POST" })
      if (!response.ok) {
        throw new Error("Failed to advance week")
      }
      // Optionally, you can refetch scores or update the UI here
      console.log("Week advanced successfully")
    } catch (error) {
      console.error("Error advancing week:", error)
    }
  }

  return (
    <aside className="w-64 bg-gray-100 flex flex-col h-full">
      <div className="p-4 flex-grow overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mb-4">Latest Scores</h2>
        {isLoading ? (
          <p>Loading scores...</p>
        ) : (
          <ScrollArea className="h-[calc(15vh)] flex-grow">
            {scores.map((score) => (
              <Card key={score.id} className="mb-2 border-b">
                <CardContent className="p-2">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <Link
                        href={`/team/${encodeURIComponent(score.homeTeam)}`}
                        className="font-bold hover:underline text-sm"
                      >
                        {score.homeTeam}
                      </Link>
                      <span className="font-bold text-sm">{score.homeScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/team/${encodeURIComponent(score.awayTeam)}`} className="hover:underline text-sm">
                        {score.awayTeam}
                      </Link>
                      <span className="text-sm">{score.awayScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
        <Button onClick={advanceWeek} className="w-full">
          Advance Week
        </Button>
    </aside>
  )
}

