import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"
import Head from 'next/head';


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sense AI",
  description: "Chat with your documents using AI",
  generator: 'codefulcrum'
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={cn("flex min-h-svh flex-col antialiased bg-secondary text-white", inter.className)}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </body>
    </html>
  )
}
