"use client"

import { useState } from "react"
import { ClubIcon, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLeagueStore } from "@/app/store/leagueStore"
import { Team } from "@/app/types/team"

export default function CreateLoadLeague() {
  const [activeTab, setActiveTab] = useState("load")
  const [leagueKey, setLeagueKey] = useState("")
  const [newLeagueName, setNewLeagueName] = useState("")
  const [newLeagueKey, setNewLeagueKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { teams, setTeams, setUserTeam, setLeague, setSchedule, setRoster } = useLeagueStore();

  const router = useRouter()

  const handleLoadLeague = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await fetch("http://localhost:8080/load-league", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({leagueName: "", leagueKey: leagueKey }),
      })

      if (!response.ok) {
        throw new Error("Failed to load league")
      }

      const data = await response.json()
      
      if (!data) {
        throw new Error("League not found - please check your league key")
      }

      // Save the league to local storage
      localStorage.setItem("world", JSON.stringify(data))
      
      setTeams(data.teams)
      setSchedule(data.schedule)
      setRoster(data.roster)

      // find user team
      const userTeam = data.teams.find((team: Team) => team.userTeam)
      setUserTeam(userTeam)

      router.push(`/league/home/${userTeam.name.toLowerCase()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLeague = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8080/create-league", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leagueName: newLeagueName, leagueKey: newLeagueKey }),
      })

      if (!response.ok) {
        throw new Error("Failed to create league")
      }

      const league = await response.json()
      console.log("League created:", league)

      // Save the league to local storage
      localStorage.setItem("world", JSON.stringify(league))
      
      setTeams(league.teams)
      setSchedule(league.schedule)
      setRoster(league.roster)      

      router.push(`/select-team`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <ClubIcon className="w-6 h-6" />
            <h1 className="text-xl font-bold">NFL League Manager</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">Create a new league or load an existing one</p>
        </div>

        <div className="p-4">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-4 text-center ${activeTab === "load" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("load")
                setError(null)
              }}
            >
              Load League
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${activeTab === "create" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("create")
                setError(null)
              }}
            >
              Create League
            </button>
          </div>

          {/* Error message display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "load" && (
            <form onSubmit={handleLoadLeague} className="mt-4 space-y-4">
              <div>
                <label htmlFor="leagueKey" className="block text-sm font-medium text-gray-700">
                  League Key
                </label>
                <input
                  type="text"
                  id="leagueKey"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter your league key"
                  value={leagueKey}
                  onChange={(e) => setLeagueKey(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : "Load League"}
              </button>
            </form>
          )}

          {activeTab === "create" && (
            <form onSubmit={handleCreateLeague} className="mt-4 space-y-4">
              <div>
                <label htmlFor="newLeagueName" className="block text-sm font-medium text-gray-700">
                  League Name
                </label>
                <input
                  type="text"
                  id="newLeagueName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter a name for your new league"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="newLeaugeKkey" className="block text-sm font-medium text-gray-700">
                  League Key
                </label>
                <input
                  type="text"
                  id="newLeaugeKkey"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter a league key"
                  value={newLeagueKey}
                  onChange={(e) => setNewLeagueKey(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : "Create League"}
              </button>
            </form>
          )}
        </div>

        <div className="p-4 border-t text-sm text-gray-600">
          Join or create your NFL fantasy league and start competing!
        </div>
      </div>
    </div>
  )
}