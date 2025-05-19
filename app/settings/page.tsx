import type { Metadata } from "next"
import PasswordUpdateForm from "@/components/password-update-form"
import NotificationPreferences from "@/components/notification-preferences"

export const metadata: Metadata = {
  title: "Settings | Sensor Data Monitoring Platform",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Update Password</h2>
        <PasswordUpdateForm />
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Notification Preferences</h2>
        <NotificationPreferences />
      </div>
    </div>
  )
}
