import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ReduxProvider } from "@/components/providers/redux-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAS Builders", // Updated title to SAS Builders
  description: "Business management tools for SAS Builders", // Updated description
  generator: "v0.app",
  icons: {
    icon: "/SAS.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ReduxProvider>
          <Navbar />
          {children}
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
