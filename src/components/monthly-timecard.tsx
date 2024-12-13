"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from 'date-fns';

// Status badge variants
const getStatusBadge = (status: string) => {
  const variants = {
    Work: "bg-green-100 text-green-800 hover:bg-green-100",
    'Paid-Dayoff': "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    'Day-off': "bg-red-100 text-red-800 hover:bg-red-100",
    Absent: "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
  return variants[status as keyof typeof variants] || ""
}

// Generate sample employee data
const generateEmployees = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const id = `EMP${(1001 + i).toString().padStart(4, '0')}`
    return {
      id,
      name: `Employee ${id.slice(-4)}`
    }
  })
}

// Generate sample data for the entire month of October
const generateOctoberData = (employees: { id: string, name: string }[]) => {
  const data = []
  const startDate = new Date(2024, 9, 1) // October 1, 2024
  const endDate = new Date(2024, 9, 31) // October 31, 2024

  for (const employee of employees) {
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
      
      if (isWeekend) {
        data.push({
          id: employee.id,
          name: employee.name,
          date: `10/${d.getDate().toString().padStart(2, '0')} (${dayOfWeek})`,
          startTime: "-",
          endTime: "-",
          total: "-",
          sensitive: "-",
          nonSensitive: "-",
          shortBreak: "-",
          mealBreak: "-",
          status: "Day-off"
        })
      } else {
        const randomStatus = Math.random() < 0.08 ? "Absent" : (Math.random() < 0.08 ? "Paid-Dayoff" : "Work")
        const randomTotal = Math.random() < 0.2 ? "8:30" : "8:00"
        data.push({
          id: employee.id,
          name: employee.name,
          date: `10/${d.getDate().toString().padStart(2, '0')} (${dayOfWeek})`,
          startTime: "09:00",
          endTime: randomTotal === "8:30" ? "17:30" : "17:00",
          total: randomTotal,
          sensitive: `${Math.floor(Math.random() * 5 + 1)}:${Math.random() < 0.5 ? '00' : '30'}`,
          nonSensitive: `${Math.floor(Math.random() * 4 + 1)}:${Math.random() < 0.5 ? '00' : '30'}`,
          shortBreak: "0:15",
          mealBreak: "0:45",
          status: randomStatus
        })
      }
    }
  }

  return data
}

const allEmployeesOption = { id: "All", name: "All" };
const employees = [allEmployeesOption, ...generateEmployees(5)] // Generate 5 employees
const timeCardData = generateOctoberData(employees.slice(1))
const statusOptions = ["All [Status]", "Work", "Paid-Dayoff", "Day-off", "Absent"]

type SortableColumn = "total" | "startTime" | "endTime" | "sensitive" | "nonSensitive" | "shortBreak" | "mealBreak"

export function MonthlyTimecard() {
  const [selectedEmployee, setSelectedEmployee] = React.useState(employees[0])
  const [selectedStatus, setSelectedStatus] = React.useState("All")
  const [sortColumn, setSortColumn] = React.useState<SortableColumn | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date(2024, 9, 1)); // October 1, 2024 or null for "All [Date]"
  const [searchQuery, setSearchQuery] = React.useState("") // Added searchQuery state

  const dateOptions = React.useMemo(() => {
    const options = [];
    const year = 2024; // Hardcoded for this example
    const month = 9; // October (0-indexed)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      options.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM dd, yyyy')
      });
    }
    return options;
  }, []);

  const filteredData = React.useMemo(() => {
    let filtered = timeCardData.filter(record => 
      (selectedEmployee.id === "All" || record.id === selectedEmployee.id) && 
      (selectedStatus === "All [Status]" || record.status === selectedStatus) &&
      (!selectedDate || record.date.startsWith(format(selectedDate, 'MM/dd'))) &&
      (searchQuery === "" || 
       record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
       record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
       record.status.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    if (sortColumn) {
      filtered.sort((a, b) => {
        if (a[sortColumn] === "-" || b[sortColumn] === "-") return 0
        const aValue = a[sortColumn].split(":").reduce((acc, time) => acc * 60 + +time, 0)
        const bValue = b[sortColumn].split(":").reduce((acc, time) => acc * 60 + +time, 0)
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      })
    }

    return filtered
  }, [selectedEmployee, selectedStatus, selectedDate, sortColumn, sortDirection, searchQuery])

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const SortableHeader: React.FC<{ column: SortableColumn; children: React.ReactNode }> = ({ column, children }) => (
    <TableHead>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{children}</span>
            {sortColumn === column ? (
              sortDirection === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort(column)}>
            Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort(column)}>
            Sort Descending
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  )

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle className="m-12 text-center text-4xl font-medium">
          Monthly Records - {selectedDate ? format(selectedDate, 'MMMM yyyy') : format(new Date(), 'MMMM yyyy') }
        </CardTitle>
        <div className="flex justify-center mt-4 space-x-4">
          <Select
            value={selectedEmployee.id}
            onValueChange={(value) => setSelectedEmployee(employees.find(emp => emp.id === value) || employees[0])}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.id === "All" ? "All" : `${emp.name} (${emp.id})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'all'}
            onValueChange={(value) => setSelectedDate(value === 'all' ? null : new Date(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All [Date]</SelectItem>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search records"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-220px)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[80px]">Date</TableHead>
                <TableHead>Status</TableHead>
                <SortableHeader column="total">Total</SortableHeader>
                <SortableHeader column="startTime">Start Time</SortableHeader>
                <SortableHeader column="endTime">End Time</SortableHeader>
                <SortableHeader column="sensitive">Sensitive</SortableHeader>
                <SortableHeader column="nonSensitive">Non-sensitive</SortableHeader>
                <SortableHeader column="shortBreak">Short Break</SortableHeader>
                <SortableHeader column="mealBreak">Meal Break</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/50'}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusBadge(record.status)} font-normal`}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.total}</TableCell>
                  <TableCell>{record.startTime}</TableCell>
                  <TableCell>{record.endTime}</TableCell>
                  <TableCell>{record.sensitive}</TableCell>
                  <TableCell>{record.nonSensitive}</TableCell>
                  <TableCell>{record.shortBreak}</TableCell>
                  <TableCell>{record.mealBreak}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

