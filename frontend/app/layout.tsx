"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/app/components/Navbar"
import Sidebar from "@/app/components/Sidebar"
import NewsTicker from "@/app/components/NewsTicker"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
          <NewsTicker />
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

