"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
    dataAlerts: true,
    systemUpdates: false,
    weeklyReports: true,
  })

  const { toast } = useToast()

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    // In a real app, this would call an API endpoint
    console.log("Saving preferences:", preferences)

    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Notification Channels</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex-1">
              Email Notifications
            </Label>
            <Switch
              id="email-notifications"
              checked={preferences.email}
              onCheckedChange={() => handleToggle("email")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications" className="flex-1">
              SMS Notifications
            </Label>
            <Switch id="sms-notifications" checked={preferences.sms} onCheckedChange={() => handleToggle("sms")} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex-1">
              Push Notifications
            </Label>
            <Switch id="push-notifications" checked={preferences.push} onCheckedChange={() => handleToggle("push")} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Notification Types</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-alerts" className="flex-1">
              Data Alerts
              <span className="block text-xs text-gray-500">Get notified when sensor values exceed thresholds</span>
            </Label>
            <Switch
              id="data-alerts"
              checked={preferences.dataAlerts}
              onCheckedChange={() => handleToggle("dataAlerts")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="system-updates" className="flex-1">
              System Updates
              <span className="block text-xs text-gray-500">Get notified about system maintenance and updates</span>
            </Label>
            <Switch
              id="system-updates"
              checked={preferences.systemUpdates}
              onCheckedChange={() => handleToggle("systemUpdates")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-reports" className="flex-1">
              Weekly Reports
              <span className="block text-xs text-gray-500">Receive weekly summary reports of your sensor data</span>
            </Label>
            <Switch
              id="weekly-reports"
              checked={preferences.weeklyReports}
              onCheckedChange={() => handleToggle("weeklyReports")}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
        Save Preferences
      </Button>
    </div>
  )
}
