"use client"

import { Database, Clock, Activity } from "lucide-react"

// Mock data - in a real app, this would come from an API
const summaryData = {
  totalTables: 5,
  lastDataReceived: "2023-05-18T14:32:00Z",
  activeDevices: 12,
}

export default function SummaryCards() {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tables</p>
            <h3 className="text-2xl font-bold">{summaryData.totalTables}</h3>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-teal-100 p-3 text-teal-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Data Received</p>
            <h3 className="text-lg font-bold">{formatDate(summaryData.lastDataReceived)}</h3>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Devices</p>
            <h3 className="text-2xl font-bold">{summaryData.activeDevices}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
