"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - in a real app, this would come from an API
const generateChartData = (tableName: string, count: number) => {
  const data = []
  const now = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setHours(date.getHours() - i)

    let value
    switch (tableName) {
      case "Temperature":
        value = 20 + Math.sin(i / 2) * 5 + (Math.random() * 2 - 1)
        break
      case "Humidity":
        value = 50 + Math.cos(i / 3) * 10 + (Math.random() * 4 - 2)
        break
      case "Pressure":
        value = 1010 + Math.sin(i / 4) * 5 + (Math.random() * 2 - 1)
        break
      case "Light":
        value = 800 + Math.sin(i / 2) * 200 + (Math.random() * 50 - 25)
        break
      default:
        value = 50 + Math.sin(i / 2) * 20 + (Math.random() * 5 - 2.5)
    }

    data.push({
      timestamp: date.toISOString(),
      value: Number.parseFloat(value.toFixed(1)),
    })
  }

  return data
}

type SensorChartProps = {
  tableName: string
}

export default function SensorChart({ tableName }: SensorChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Generate mock data based on table name
    const data = generateChartData(tableName, 24)
    setChartData(data)
  }, [tableName])

  // Get unit based on table name
  const getUnit = () => {
    switch (tableName) {
      case "Temperature":
        return "°C"
      case "Humidity":
        return "%"
      case "Pressure":
        return "hPa"
      case "Light":
        return "lux"
      default:
        return ""
    }
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format value for tooltip
  const formatValue = (value: number) => {
    return `${value}${getUnit()}`
  }

  return (
    <div className="h-[300px] w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp} 
              tickCount={6} 
            />
            <YAxis 
              tickFormatter={(value) => `${value}${getUnit()}`} 
              width={60} 
            />
            <Tooltip
              formatter={(value: number) => [`${value}${getUnit()}`, 'Value']}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Line 
              type="monotone"
              dataKey="value" 
              stroke="#0ea5e9" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6, fill: "#0ea5e9" }} 
              />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      )}
    </div>
  )
}
