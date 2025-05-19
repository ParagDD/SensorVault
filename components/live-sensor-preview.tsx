"use client"

import { useState, useEffect } from "react"
import { Activity } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockSensorData = [
  { id: "1", name: "Temperature", value: "24.5°C", status: "normal" },
  { id: "2", name: "Humidity", value: "45%", status: "normal" },
  { id: "3", name: "Pressure", value: "1013 hPa", status: "warning" },
  { id: "4", name: "Light", value: "850 lux", status: "normal" },
  { id: "5", name: "Motion", value: "Detected", status: "alert" },
]

export default function LiveSensorPreview() {
  const [sensorData, setSensorData] = useState(mockSensorData)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prevData) =>
        prevData.map((sensor) => {
          if (sensor.name === "Temperature") {
            const newValue = (20 + Math.random() * 10).toFixed(1)
            return { ...sensor, value: `${newValue}°C` }
          }
          if (sensor.name === "Humidity") {
            const newValue = Math.floor(40 + Math.random() * 20)
            return { ...sensor, value: `${newValue}%` }
          }
          return sensor
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-700"
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "alert":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sensorData.map((sensor) => (
          <div key={sensor.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{sensor.name}</p>
              <p className="text-2xl font-bold">{sensor.value}</p>
            </div>
            <div
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                sensor.status,
              )}`}
            >
              <Activity className="mr-1 h-3 w-3" />
              {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
