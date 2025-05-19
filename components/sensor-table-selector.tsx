"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - in a real app, this would come from an API
const sensorTables = [
  { id: "1", name: "Temperature" },
  { id: "2", name: "Humidity" },
  { id: "3", name: "Pressure" },
  { id: "4", name: "Light" },
  { id: "5", name: "Motion" },
  { id: "6", name: "Vibration" },
  { id: "7", name: "Sound" },
  { id: "8", name: "Air Quality" },
  { id: "9", name: "Water Level" },
  { id: "10", name: "Voltage" },
]

export default function SensorTableSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedTable, setSelectedTable] = useState<string>("Temperature")

  // Extract table name from URL if on a table page
  useEffect(() => {
    if (pathname.startsWith("/data/")) {
      const tableName = pathname.split("/").pop()
      if (tableName && tableName !== "Activity") {
        setSelectedTable(tableName)
      }
    }
  }, [pathname])

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName)

    // Navigate to the selected table page
    if (pathname === "/data") {
      // If we're on the main data page, update the view without navigation
      // In a real app, this would update the state to show the selected table
      // For now, we'll navigate to the table page
      router.push(`/data/${tableName}`)
    } else {
      // If we're on another page, navigate to the table page
      router.push(`/data/${tableName}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {selectedTable}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {sensorTables.map((table) => (
          <DropdownMenuItem key={table.id} onClick={() => handleTableSelect(table.name)} className="cursor-pointer">
            {table.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
