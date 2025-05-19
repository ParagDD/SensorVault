import type { Metadata } from "next"
import SensorDropdown from "@/components/sensor-dropdown"
import SummaryCards from "@/components/summary-cards"
import LiveSensorPreview from "@/components/live-sensor-preview"

export const metadata: Metadata = {
  title: "Dashboard | Sensor Data Monitoring Platform",
  description: "View your sensor data at a glance",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <SensorDropdown />
      </div>

      <SummaryCards />

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Live Sensor Values</h2>
        <LiveSensorPreview />
      </div>
    </div>
  )
}
