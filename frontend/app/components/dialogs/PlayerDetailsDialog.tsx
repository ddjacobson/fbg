"use client"
import Image from "next/image"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/app/ui/dialog"
import type { Player } from "@/app/types/player"
import { DialogClose } from "@radix-ui/react-dialog"
import { getTeamLogo } from "@/app/constants/nfl"
import { ScrollArea } from "@/app/ui/scroll-area"

interface PlayerDetailsDialogProps {
  player: Player | null
  team: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlayerDetailsDialog({ player, open, onOpenChange }: PlayerDetailsDialogProps) {
    if (!player) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="flex p-3 relative">
          <Image
            src={getTeamLogo(player.teamName.split(" ").pop())}
            alt={`${player.teamName} Logo`}
            width={60}
            height={60}
            className="rounded-full object-contain"
          />
          <DialogHeader>
            <DialogTitle className="text-black text-xl font-bold flex items-center justify-between">
              <p className="pt-4 pl-2">{player.name}</p>
              <DialogClose className="absolute right-4 top-4">
                <X className="h-5 w-5 text-white hover:text-gray-200" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-center items-start">
              <div className="w-full">
                <Image
                  src={player.headshotUrl || `/placeholder.svg?height=192&width=192`}
                  alt={player.name}
                  width={320}
                  height={320}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <ScrollArea className="h-[200px] w-full">
            <div className="px-6 space-y-3">
              <div className="bg-gray-100 p-1 rounded-md">
                <p className="text-lg text-center">{player.teamName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 p-2 rounded-md">
                  <h3 className="text-md font-semibold text-gray-500">Position</h3>
                  <p className="text-lg">{player.position}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <h3 className="text-md font-semibold text-gray-500">Number</h3>
                  <p className="text-lg">#{player.jerseyNo || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 p-2 rounded-md">
                  <h3 className="text-md font-semibold text-gray-500">Height</h3>
                  <p className="text-lg">{player.height} in</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <h3 className="text-md font-semibold text-gray-500">Weight</h3>
                  <p className="text-lg">{player.weight} lbs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 p-2 rounded-md">
                  <h3 className="text-md font-semibold text-gray-500">College</h3>
                  <p className="text-xs">{player.college}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <h3 className="text-md font-semibold text-gray-500">Experience</h3>
                  <p className="text-lg">{player.exp}</p>
                </div>
              </div>
            </div>
            </ScrollArea>
          </div>

          <ScrollArea className="h-[200px] w-full mt-4 border-t pt-4">
            <h3 className="text-xl font-bold mb-3 sticky top-0 bg-white pb-1">Player Ratings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 pr-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500">Speed</h4>
                <p className="text-lg font-bold">{player.speedRtg}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500">Strength</h4>
                <p className="text-lg font-bold">{player.strengthRtg || "N/A"}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500">Agility</h4>
                <p className="text-lg font-bold">{player.agilityRtg || "N/A"}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500">Jumping</h4>
                <p className="text-lg font-bold">{player.jumpingRtg || "N/A"}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500">Injury</h4>
                <p className="text-lg font-bold">{player.injuryRtg || "N/A"}</p>
              </div>

            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}