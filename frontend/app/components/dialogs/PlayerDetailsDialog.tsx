"use client"
import Image from "next/image"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/app/ui/dialog"
import type { Player } from "@/app/types/player"
import { DialogClose } from "@radix-ui/react-dialog"

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
        <div className={`p-3 relative`}>
          <DialogHeader>
            <DialogTitle className="text-black text-2xl font-bold flex items-center justify-between">
              {player.name}
              <DialogClose className="absolute right-4 top-4">
                <X className="h-6 w-6 text-white hover:text-gray-200" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-start">
              <div>
                <Image
                  src={player.headshotUrl || `/placeholder.svg?height=192&width=192`}
                  alt={player.name}
                  width={292}
                  height={292}
                />
              </div>
            </div>

            <div className="space-y-4">
            <div className="bg-gray-100 p-2 rounded-md">
              <p className="text-xl text-center">{player.teamName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded-md">
              <h3 className="text-lg font-semibold text-gray-500">Position</h3>
                  <p className="text-xl">{player.position}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-500">Number</h3>
                  <p className="text-xl">#{player.jerseyNo || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-500">Height</h3>
                  <p className="text-xl">{player.height} in</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-500">Weight</h3>
                  <p className="text-xl">{player.weight} lbs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-xl font-bold mb-4">Player Ratings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Speed</h4>
                <p className="text-2xl font-bold">{player.speedRtg}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Strength</h4>
                <p className="text-2xl font-bold">{player.strengthRtg || "N/A"}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Agility</h4>
                <p className="text-2xl font-bold">{player.agilityRtg || "N/A"}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">College</h4>
                <p className="text-2xl font-bold">{player.college || "N/A"}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                <p className="text-2xl font-bold">{player.exp || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

