import Link from "next/link"
import { Button } from "@/app/ui/button"
import { useLeagueStore } from "../store/leagueStore"



export default function Navbar(  ) {
  const userTeam = useLeagueStore().userTeam
  // console.log("userTeam", userTeam)

  const navItems = [
    { name: "Home", href: "/league/home/" + userTeam?.name.toLowerCase() },
    { name: "Roster", href: "/league/roster/"+ userTeam?.name.toLowerCase() },
    { name: "Teams", href: "/league/teams/"+ userTeam?.name.toLowerCase() },
    { name: "Stats", href: "/league/stats/"},
    { name: "Schedule", href: "/schedule/" + userTeam?.name.toLowerCase() },
  ]

  return (
    <nav className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex items-center">
        <Link href="/" className="text-2xl font-bold mr-8">
          NFL Sim
        </Link>
        <div className="flex-grow flex justify-center">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button variant="ghost" asChild>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </nav>
  )
}

