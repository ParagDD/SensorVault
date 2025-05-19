"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  phoneNumber: string
  // We might add more user details later if needed
}

type AuthContextType = {
  user: User | null
  token: string | null // Add token to context type
  login: (phoneNumber: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Remove the API_URL constant
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null) // Add token state
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false); // State to track if component is mounted on client
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true); // Mark component as mounted on client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on client after initial render

    // Check for stored token on load
    const storedToken = localStorage.getItem("accessToken")
    if (storedToken) {
      // Basic check: just set the token. 
      // In a real app, you would verify the token validity here (e.g., check expiry, hit a protected endpoint)
      console.log("Found stored token, setting token state."); // Added log
      setToken(storedToken)
      // Optionally, decode the token client-side to get user info if needed (be mindful of security implications)
      try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          if (payload && payload.sub) {
              console.log("Decoded token payload, setting user state.", payload.sub); // Added log
              setUser({ phoneNumber: payload.sub });
          } else {
               // If payload is invalid, remove the token
              console.error("Invalid token payload");
              localStorage.removeItem("accessToken");
              setToken(null);
              setUser(null);
          }
      } catch (e) {
          console.error("Failed to decode or parse token", e);
          // If token is invalid, remove it
          localStorage.removeItem("accessToken");
          setToken(null);
          setUser(null);
      }
    }
    setIsLoading(false)
    console.log("Auth loading finished."); // Added log
  }, [isClient]) // Depend on isClient

  useEffect(() => {
    if (!isClient || isLoading) return; // Only run on client when not loading

    console.log("Auth effect: Token changed or loading finished.", { token: !!token, pathname }); // Added log

    // Protect routes based on token presence
      const isLoginPage = pathname === "/login"
    const isRegisterPage = pathname === "/register"; // Check if it's the register page

    // Define routes that do NOT require authentication
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Redirect to login if no token and not on a public route
    if (!token && !isPublicRoute) {
        console.log("Redirecting to login: No token and not on public route.", pathname); // Added log
        router.push("/login")
    } 
    // Redirect to dashboard if token exists and on a public auth route (login/register)
    else if (token && (isLoginPage || isRegisterPage)) {
        console.log("Redirecting to dashboard: Token exists and on auth page.", pathname); // Added log
        router.push("/dashboard")
    }
  }, [token, isLoading, pathname, router, isClient]) // Depend on token state and isClient

  const login = async (phoneNumber: string, password: string) => {
    debugger;
    setIsLoading(true);
    // Add error state to context
    const [error, setError] = useState<string | null>(null);

    setError(null); // Clear any previous errors
    console.log("Attempting login for", phoneNumber); // Added log
    try {
      // Use relative API path
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // Format data as x-www-form-urlencoded
        body: `username=${encodeURIComponent(phoneNumber)}&password=${encodeURIComponent(password)}`,
      });

      console.log("Login API response status:", response.status); // Added log

      // Check if the response status is NOT ok (e.g., 401, 400, 500)
      if (!response.ok) {
        let errorDetail = 'Login failed';
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch (jsonError) {
            console.error("Failed to parse error response JSON:", jsonError);
            errorDetail = `Login failed: ${response.statusText}`;
        }
        console.error("Login failed with status", response.status, ":", errorDetail); // Added log
        // Clear any existing token/user on failed login attempt
        setToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        throw new Error(errorDetail);
      }

      // If response is ok, process the token
      const data = await response.json();
      const fetchedToken = data.access_token;

      console.log("Login successful, received token.", fetchedToken ? "(token received)" : "(no token received)"); // Added log

      if (!fetchedToken) {
          console.error("Login successful but no access_token in response."); // Added log
          throw new Error("Login failed: No access token received.");
      }

      // Store token in localStorage (Note: HttpOnly cookies are more secure)
      localStorage.setItem("accessToken", fetchedToken);
      setToken(fetchedToken);
      
      // Decode token to get user info (phone number)
      try {
          const payload = JSON.parse(atob(fetchedToken.split('.')[1]));
          if (payload && payload.sub) {
              console.log("Token decoded, setting user:", payload.sub); // Added log
              setUser({ phoneNumber: payload.sub });
          } else {
               console.error("Token payload is missing subject (sub)");
               // Token might be valid but lacks expected payload structure - treat as login failed
               setToken(null);
               setUser(null);
               localStorage.removeItem("accessToken");
               throw new Error("Login failed: Invalid token received");
          }
      } catch (e) {
          console.error("Failed to decode or parse token after login", e);
          // If token is malformed, treat as login failed
          setToken(null);
          setUser(null);
          localStorage.removeItem("accessToken");
          throw new Error("Login failed: Invalid token format");
      }

      console.log("Login function finished successfully."); // Added log

    } catch (error) {
      // This catches errors from fetch itself or errors thrown above
      console.error("Login process error:", error);
      // Ensure state is clean on any error during the login process
      setToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      // Re-throw the error so the component calling login can handle it (e.g., show toast)
      throw error; 
    } finally {
      setIsLoading(false);
       console.log("Login process finished (finally block)."); // Added log
    }
  };

  const logout = () => {
    console.log("Logging out."); // Added log
    setUser(null)
    setToken(null) // Clear token state on logout
    localStorage.removeItem("accessToken") // Remove token from storage
    router.push("/login")
  }

  // Add error state to context
  const [error, setError] = useState<string | null>(null);

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider> // Provide token in context
}

// Export useAuth separately if needed elsewhere (already done above)
// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
