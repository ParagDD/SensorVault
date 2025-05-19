"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
import { useToast } from '@/components/ui/use-toast'; // Import useToast hook

// Use direct API URL instead of relying on the Next.js proxy
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Remove mock data
// const sensorTables = [
//   { id: "1", name: "Temperature" },
//   { id: "2", name: "Humidity" },
//   { id: "3", name: "Pressure" },
//   { id: "4", name: "Light" },
//   { id: "5", name: "Motion" },
// ]

export default function SensorDropdown() {
  const router = useRouter()
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [availableTables, setAvailableTables] = useState<string[]>([]); // State for available tables
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const { token } = useAuth(); // Get token from auth hook
  const { toast } = useToast(); // Get toast hook

  // Fetch available tables when component mounts or token changes
  useEffect(() => {
    const fetchTables = async () => {
      console.log("SensorDropdown useEffect: fetching tables..."); // Added log
      if (!token) {
        console.log("SensorDropdown useEffect: No token, stopping fetch."); // Added log
        setIsLoading(false); // Stop loading if no token
        return; // Don't fetch if no token
      }

      setIsLoading(true);
      setError(null);
      const tablesApiUrl = `${API_URL}/api/v1/data/tables`;
      console.log("SensorDropdown useEffect: Fetching from URL:", tablesApiUrl); // Added log

      try {
        const response = await fetch(tablesApiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Added content type header
          },
        });

        console.log("SensorDropdown useEffect: Fetch response status:", response.status); // Added log
        console.log("SensorDropdown useEffect: Fetch response headers:", response.headers); // Added log

        // Check if the response is OK, but also check content type before parsing as JSON
        const contentType = response.headers.get("content-type");
        if (!response.ok || (contentType && !contentType.includes("application/json"))) {
             let errorDetail = `Error fetching tables: ${response.status} ${response.statusText}`;
             let responseText = "Could not read response body";

             try {
                 // Attempt to read body as text for better error message
                 responseText = await response.text();
                 console.error("SensorDropdown useEffect: Received non-JSON or error response body:", responseText); // Added log
                 
                 // If it's an HTML response, try to extract a title or message
                 if (responseText.startsWith("<!DOCTYPE html>")) {
                     const parser = new DOMParser();
                     const htmlDoc = parser.parseFromString(responseText, 'text/html');
                     const titleElement = htmlDoc.querySelector('title');
                     errorDetail = titleElement ? `Error: ${titleElement.textContent}` : `Error: Received unexpected HTML response (Status: ${response.status})`;
                 } else {
                      // If not HTML, maybe it's a backend error JSON we couldn't parse earlier
                      try {
                         const errorData = JSON.parse(responseText);
                         errorDetail = errorData.detail || JSON.stringify(errorData);
                      } catch (jsonError) {
                          // Still couldn't parse as JSON
                           errorDetail = `Error: Received unexpected response format (Status: ${response.status})`;
                           console.error("SensorDropdown useEffect: Failed to parse non-JSON response as JSON:", jsonError); // Added log
                      }
                 }

             } catch (readError) {
                 console.error("SensorDropdown useEffect: Failed to read response body:", readError); // Added log
             }

             // If the response was not OK, throw an error with status and potentially more detail
             if (!response.ok) {
                  throw new Error(errorDetail);
             } else {
                  // If response was OK but not JSON (e.g., HTML 200), still an error for us
                   throw new Error(errorDetail);
             }
        }

        const data = await response.json(); // This is where the SyntaxError happens if response is not JSON
        console.log("SensorDropdown useEffect: Received data:", data); // Added log

        setAvailableTables(data.tables || []);

        // Optionally set a default selected table if available
        if (data.tables && data.tables.length > 0) {
            setSelectedTable(data.tables[0]);
        } else {
            setSelectedTable('');
        }

      } catch (err: any) {
        console.error("SensorDropdown useEffect: Fetch error caught:", err); // Added log
        setError(err.message || "An error occurred while fetching tables.");
         toast({
          title: "Error Fetching Tables",
          description: err.message || "Could not load sensor tables.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
         console.log("SensorDropdown useEffect: Fetch process finished."); // Added log
      }
    };

    if (token) { // Fetch tables only if token is available
      fetchTables();
    } else {
       console.log("SensorDropdown useEffect: Token not available yet, not fetching tables."); // Added log
       setIsLoading(false);
    }
  }, [token]); // Depend on token

  const handleTableChange = (value: string) => {
    setSelectedTable(value)
    router.push(`/data/${value}`)
  }

  if (isLoading) {
    return <div className="text-center">Loading tables...</div>; // Loading state
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>; // Display specific error
  }

  if (availableTables.length === 0) {
      return <div className="text-center">No sensor tables available.</div>; // No tables state
  }

  return (
    <div className="w-full sm:w-64">
      <Select value={selectedTable} onValueChange={handleTableChange} disabled={availableTables.length === 0 || isLoading}> {/* Disable if no tables or loading */}
        <SelectTrigger>
          <SelectValue placeholder="Select sensor table" />
        </SelectTrigger>
        <SelectContent>
          {availableTables.map((table) => (
            <SelectItem key={table} value={table}>
              {table}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
