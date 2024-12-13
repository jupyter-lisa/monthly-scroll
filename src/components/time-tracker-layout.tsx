"use client"

import * as React from "react"
import { Bell, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sidebar } from "./sidebar"
import { MonthlyTimecard } from "./monthly-timecard"

export function TimeTrackerLayout() {
  const [currentOrg, setCurrentOrg] = React.useState("Organization A")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="flex h-14 items-center justify-between border-b px-4 bg-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">IO</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {currentOrg} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCurrentOrg("Organization A")}>
                Organization A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentOrg("Organization B")}>
                Organization B
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentOrg("Organization C")}>
                Organization C
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm">CN</Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar currentOrg={currentOrg} setCurrentOrg={setCurrentOrg} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <MonthlyTimecard />
        </main>
      </div>
    </div>
  )
}

