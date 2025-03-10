"use client"

import { TeamPage } from "@/app/components/TeamPage"
import { useEffect, useState } from 'react';


interface Team {
  city: string
  conf: string
  division: string
  leagueId: string
  logoUrl: string
  losses: number
  name: string
  teamId: string
  ties: number
  userTeam: boolean
  wins: number
}

export default function Home() {
  const [data, setData] = useState<Team | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("currentTeam");
    if (storedData) {
      setData(JSON.parse(storedData));
      // console.log("Data from localStorage:", JSON.parse(storedData));
    }


  }, []); // Runs only on client mount


  return <TeamPage />

}

