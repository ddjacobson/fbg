import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NFL League Manager",
  description: "Create and manage your NFL leagues",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">NFL League Manager</h1>
          </div>
        </header>


        <main>{children}</main>

        <footer className="bg-gray-200 text-center p-4 mt-">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} NFL Sim by Dane Jacobson. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

