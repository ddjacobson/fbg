"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/app/ui/card"

interface Score {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
}

const getScoresURL = 'http://localhost:8080/api/getAllScores'

export default function Sidebar() {
  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch(getScoresURL)
        if (!response.ok) {
          console.log(response)
          throw new Error("Failed to fetch scores")
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

  return (
    <aside className="w-64 bg-gray-100 overflow-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Today's Scores</h2>
        {isLoading ? (
          <p>Loading scores...</p>
        ) : (
          scores.map((score) => (
            <Card key={score.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{score.homeTeam}</p>
                    <p>{score.awayTeam}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{score.homeScore}</p>
                    <p>{score.awayScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </aside>
  )
}

