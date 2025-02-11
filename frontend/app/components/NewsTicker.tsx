"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/app/ui/button"



const newsItems = [
  "Breaking: Tom Brady announces comeback from retirement",
  "NFL Draft: Top prospects showcase skills at combine",
  "Super Bowl LVIII set for Las Vegas, marking a first for the city",
  "League announces new safety protocols for upcoming season",
  "Record-breaking viewership for last night's prime time game",
]

export default function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false)
  const [translateX, setTranslateX] = useState(0)
  const tickerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    if (tickerRef.current) {
      setTranslateX((prevTranslateX) => {
        const newTranslateX = prevTranslateX - 1
        if (-newTranslateX >= tickerRef.current!.offsetWidth / 2) {
          return 0
        }
        return newTranslateX
      })
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, animate])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <div className="bg-gray-800 text-white flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePause}
        className="h-full px-3 py-2 rounded-none border-r border-gray-700"
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
        <span className="sr-only">{isPaused ? "Play" : "Pause"} news ticker</span>
      </Button>
      <div className="flex-1 overflow-hidden py-2 px-4">
        <div
          ref={tickerRef}
          className="whitespace-nowrap inline-block"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {newsItems.map((item, index) => (
            <span key={index} className="mx-4">
              {item}
            </span>
          ))}
          {newsItems.map((item, index) => (
            <span key={`repeat-${index}`} className="mx-4">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

