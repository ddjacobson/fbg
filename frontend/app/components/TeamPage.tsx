import Image from "next/image"
import { TeamSchedule } from "@/app/components/TeamSchedule"
import { useEffect, useState } from 'react';
import { Team } from "../types/team";
import { League } from "../types/league";




export function TeamPage() {
  const emptyTeam: Team = {
    city: "",
    conf: "",
    division: "",
    leagueId: "",
    logoUrl: "",
    losses: 0,
    name: "",
    teamId: "",
    ties: 0,
    userTeam: false,
    wins: 0,
  };

  const emptyLeague: League = {
    leagueName: "",
    leagueKey: "",
    year: 0,
    week: 0,
  };

  const [team, setTeam] = useState<Team>(emptyTeam);
  const [league, setLeague] = useState<League>(emptyLeague); 
  const [schedule, setSchedule] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const teamData = localStorage.getItem("currentTeam");
      
      if (teamData) {
        setTeam(JSON.parse(teamData));
  
      } 

      const leagueData = localStorage.getItem("league");
      console.log("leagueData", leagueData)
      if (leagueData) {
        setLeague(JSON.parse(leagueData));
        console.log("League from localStorage:", JSON.parse(leagueData));
      } 

      // Fetch schedule data from the API
      
    };

    fetchData();
  }, []); // Runs only on client mount


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <Image
            src={team.name || "/placeholder.svg"}
            alt={`${team.name} Logo`}
            width={100}
            height={100}
            className="rounded-full"
          /> */}
          <div>
            <h1 className="text-4xl font-bold">{team.city} {team.name}</h1>
            <p className="text-xl">Record: {team.wins }-{team.losses}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">Week {league.week}</p>
          {/* <p className="text-lg">{league.year} Season</p> */}
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Team Schedule</h2>
      {/* <TeamSchedule teamId=  /> */}

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

