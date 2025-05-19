"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
import { useToast } from '@/components/ui/use-toast'; // Import useToast hook

// Remove the API_URL constant
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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
      if (!token) {
        setIsLoading(false); // Stop loading if no token
        return; // Don't fetch if no token
      }

      setIsLoading(true);
      setError(null);
      try {
        // Use relative API path
        const response = await fetch('/api/v1/data/tables', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
             let errorDetail = `Error fetching tables: ${response.status} ${response.statusText}`;
              try {
                  const errorData = await response.json();
                  errorDetail = errorData.detail || errorDetail;
              } catch (jsonError) {
                   console.error("Failed to parse error response as JSON:", jsonError);
              }
           throw new Error(errorDetail);
        }

        const data = await response.json();
        setAvailableTables(data.tables || []);

        // Optionally set a default selected table if available
        if (data.tables && data.tables.length > 0) {
            setSelectedTable(data.tables[0]);
        } else {
            setSelectedTable('');
        }

      } catch (err: any) {
        console.error("Error fetching tables:", err);
        setError(err.message || "An error occurred while fetching tables.");
         toast({
          title: "Error Fetching Tables",
          description: err.message || "Could not load sensor tables.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) { // Fetch tables only if token is available
      fetchTables();
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
    return <div className="text-center text-red-600">Error loading tables.</div>; // Error state
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
