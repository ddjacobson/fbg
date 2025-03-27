"use client"
import { TeamSchedule } from "@/app/components/TeamSchedule"
import { useEffect, useState } from "react"
import { useLeagueStore } from "@/app/store/leagueStore"
import Image from "next/image"
import { getTeamLogo } from "@/app/constants/nfl"

import React from "react"

export default function Page({ params }: { params: Promise<{ team: string }>; }) {
    const resolvedParams = React.use(params);

    // get team from Zustand
    const league = useLeagueStore().league
    const currTeam = useLeagueStore((state) => 
        state.teams.find(t => 
          t.name.toLowerCase() === resolvedParams.team
        )
      );

    if (!currTeam || !league) return <div>Loading...</div>
    
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={getTeamLogo(currTeam.name)}
                alt={`${currTeam.name} Logo`}
                width={100}
                height={100}
                className="rounded-full object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold">{currTeam.city} {currTeam.name}</h1>
                <p className="text-xl">Record: {currTeam.wins }-{currTeam.losses}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">Week {league.week}</p>
              {/* <p className="text-lg">{league.year} Season</p> */}
            </div>
          </div>
    
          <h2 className="mb-4 text-2xl font-semibold">Team Schedule</h2>
          <TeamSchedule teamName={currTeam.name} />
    
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold">Team News</h3>
              <ul className="space-y-2">
                {/* {news.map((item, index) => (
                  <li key={index}>{item}</li>
                ))} */}
              </ul>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold">Team Stats</h3>
              {/* <ul className="space-y-2">
                <li>Total Yards: {stats.totalYards}</li>
                <li>Passing Yards: {stats.passingYards}</li>
                <li>Rushing Yards: {stats.rushingYards}</li>
                <li>Points Scored: {stats.pointsScored}</li>
              </ul> */}
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold">Upcoming Game</h3>
              <p className="text-lg font-semibold">
                {/* Week {upcomingGame.week}: vs {upcomingGame.opponent} */}
              </p>
              <p>
                {/* {upcomingGame.date} - {upcomingGame.time} */}
              </p>
              {/* <p>{upcomingGame.location}</p> */}
            </div>
          </div>
        </div>
      )

}
