"use client"

import { useState } from "react"
import { ClubIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLeagueStore } from "@/app/store/leagueStore"

export default function CreateLoadLeague() {
  const [activeTab, setActiveTab] = useState("load")
  const [leagueKey, setLeagueKey] = useState("")
  const [newLeagueName, setNewLeagueName] = useState("")
  const [newLeagueKey, setNewLeagueKey] = useState("")
  const { teams, setTeams, setUserTeam, setLeague, setSchedule, setRoster } = useLeagueStore();

  
  const router = useRouter()

  const handleLoadLeague = async () => {

    const response = await fetch("http://localhost:8080/load-league", { 
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leagueKey }),
      })
      if (!response.ok) {
        throw new Error("Failed to advance week")
      }

  }

  const handleCreateLeague = async (event: React.FormEvent) => {
      event.preventDefault()
      console.log("Creating league with name:", newLeagueName)
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

      router.push(`/select-team`);

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
              onClick={() => setActiveTab("load")}
            >
              Load League
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${activeTab === "create" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("create")}
            >
              Create League
            </button>
          </div>

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
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Load League
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
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Create League
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

