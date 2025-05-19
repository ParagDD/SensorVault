"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
// We won't use the useAuth hook directly for registration

// Get API URL from environment or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  // Add confirm password field if needed
  // confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
})

type RegistrationFormProps = {
  // Define any props if needed
}

export default function RegistrationForm(/* props: RegistrationFormProps */) {
  const [showPassword, setShowPassword] = useState(false)
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false); // for confirm password
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      // confirmPassword: "", // for confirm password
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Implement backend API call for registration here
    console.log("Registration form submitted with values:", values);
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send data as JSON for registration
        body: JSON.stringify({
            phone_number: values.phoneNumber,
            password: values.password,
        }),
      });

      if (!response.ok) {
        let errorDetail = 'Registration failed';
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch (jsonError) {
            console.error("Failed to parse error response JSON:", jsonError);
            errorDetail = `Registration failed: ${response.statusText}`;
        }
        throw new Error(errorDetail);
      }

      // If registration is successful
      toast({
        title: "Registration successful",
        description: "You can now login with your credentials.",
      });
      // Redirect to login page after successful registration
      router.push("/login");

    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Add confirm password field here if using */}

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
            Register
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-teal-600 hover:text-teal-700">
              Login
            </a>
          </div>
        </form>
      </Form>
    </div>
  )
} 