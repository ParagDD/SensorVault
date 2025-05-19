"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';

type SensorDataTableProps = {
  tableName: string
}

export default function SensorDataTable({ tableName }: SensorDataTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('SensorDataTable useEffect - Token:', token);

    const fetchSensorData = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/data?table=${encodeURIComponent(tableName)}&page=${page}&limit=${itemsPerPage}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          let errorDetail = `Error: ${response.status} ${response.statusText}`;
          try {
              // Attempt to parse JSON even on error, as backend might send JSON errors
              const errorData = await response.json();
              errorDetail = errorData.detail || errorDetail;
          } catch (jsonError) {
              // If JSON parsing fails, use the status text as the error detail
              console.error("Failed to parse error response as JSON:", jsonError);
          }
           // Set sensor data and total items to initial state on error
          setSensorData([]);
          setTotalItems(0);
          throw new Error(errorDetail);
        }

        const data = await response.json();
        setSensorData(data.data);
        setTotalItems(data.total_items);

      } catch (err: any) {
        console.error("Error fetching sensor data:", err);
        setError(err.message || "An error occurred while fetching data.");
         toast({
          title: "Error Fetching Data",
          description: err.message || "Could not load sensor data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (tableName) {
      fetchSensorData();
    }

  }, [tableName, page, token]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  }

  const columns = sensorData.length > 0
    ? Object.keys(sensorData[0]).filter(key => key !== '_id')
    : [];

  if (isLoading) {
    return <div className="text-center">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (sensorData.length === 0) {
    return <div className="text-center">No data available for this table.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col}>{col.replace(/_/g, ' ').toUpperCase()}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensorData.map((row, rowIndex) => (
              <TableRow key={row._id || rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col + rowIndex}>{row[col] !== undefined && row[col] !== null ? row[col].toString() : ''}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setPage(i + 1)} isActive={page === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      )}
    </div>
  );
}
