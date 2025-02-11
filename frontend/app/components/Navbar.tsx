import Link from "next/link"
import { Button } from "@/app/ui/button"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Roster", href: "/roster" },
  { name: "Draft", href: "/draft" },
  { name: "Stats", href: "/stats" },
  { name: "Schedule", href: "/schedule" },
]

export default function Navbar() {
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

