import type { Metadata } from "next"
import AuthForm from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Login | Sensor Data Monitoring Platform",
  description: "Login to access your sensor data",
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sensor Monitor</h1>
          <p className="text-gray-600">Login to access your sensor data</p>
        </div>
        <AuthForm />
      </div>
    </main>
  )
}
