import type { Metadata } from "next"
import RegistrationForm from "@/components/registration-form"; // Import the RegistrationForm component
// import AuthForm from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Register | Sensor Data Monitoring Platform",
  description: "Register for a new account",
}

export default function RegisterPage() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sensor Monitor</h1>
          <p className="text-gray-600">Create a new account</p>
        </div>
        {/* We will add the RegistrationForm component here */}
        {/* For now, maybe show the login form as a placeholder */}
        <RegistrationForm /> {/* Use the RegistrationForm component */}
      </div>
    </main>
  )
} 