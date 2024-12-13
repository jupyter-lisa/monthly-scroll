import React from "react"
import { Calendar, ChevronDown, Clock, FileText, Settings, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  isActive?: boolean
  children: React.ReactNode
}

function SidebarItem({ icon: Icon, isActive, children, ...props }: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        props.className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </div>
  )
}

interface SidebarProps {
  currentOrg: string
  setCurrentOrg: (org: string) => void
}

export function Sidebar({ currentOrg, setCurrentOrg }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                {currentOrg} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
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
        <div className="flex-1 py-2">
          <nav className="space-y-2 px-2">
            <SidebarItem icon={Clock} isActive>Time Tracker</SidebarItem>
            <div className="px-3 py-2">
              <h2 className="mb-2 text-lg font-semibold tracking-tight">Analysis</h2>
              <div className="space-y-1">
                <SidebarItem icon={FileText}>Reports</SidebarItem>
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 text-lg font-semibold tracking-tight">Monthly Records</h2>
              <div className="space-y-1">
                <SidebarItem icon={Calendar}>View Records</SidebarItem>
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 text-lg font-semibold tracking-tight">Manage</h2>
              <div className="space-y-1">
                <SidebarItem icon={Users}>Organization</SidebarItem>
                <SidebarItem icon={Users}>Team</SidebarItem>
              </div>
            </div>
            <SidebarItem icon={Settings}>Settings</SidebarItem>
          </nav>
        </div>
        <div className="border-t p-4">
          <nav className="space-y-1">
            <SidebarItem>Organization B</SidebarItem>
            <SidebarItem>Organization C</SidebarItem>
          </nav>
        </div>
      </div>
    </aside>
  )
}

