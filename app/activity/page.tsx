"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SensorDataTable from "@/components/sensor-data-table";
import DataImportModal from "@/components/DataImportModal";
import ImportButton from "@/components/import-button";
import ExportButton from "@/components/export-button";
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ActivityPage() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [errorTables, setErrorTables] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { token } = useAuth();
  const { toast } = useToast();

  // Fetch available tables when component mounts or token changes
  useEffect(() => {
    const fetchTables = async () => {
      if (!token) {
        setIsLoadingTables(false);
        setErrorTables("Authentication token not found. Please log in.");
        return;
      }

      setIsLoadingTables(true);
      setErrorTables(null);
      try {
        const response = await fetch('http://localhost:8000/api/v1/data/tables', {
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
        const tables = data.tables || [];
        setAvailableTables(tables);

        // Set a default selected table if available and nothing is selected yet
        if (tables.length > 0 && selectedTable === '') {
            setSelectedTable(tables[0]);
        }

      } catch (err: any) {
        console.error("Error fetching tables:", err);
        setErrorTables(err.message || "An error occurred while fetching tables.");
         toast({
          title: "Error Fetching Tables",
          description: err.message || "Could not load sensor tables.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTables(false);
      }
    };

    if (token) { // Fetch tables only if token is available
      fetchTables();
    }
  }, [token, selectedTable]); // Depend on token and selectedTable

  const handleTableChange = (value: string) => {
    setSelectedTable(value);
  };

  return (
    <div className="space-y-6">
      {/* Header with Table Selection */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedTable} onValueChange={handleTableChange} disabled={availableTables.length === 0 || isLoadingTables}>
            <SelectTrigger className="w-[180px]">
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
      </div>

      {isLoadingTables && (
        <Card className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading tables...</p>
          </div>
        </Card>
      )}

      {errorTables && (
        <Card className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center p-8">
            <p className="text-red-600">Error loading tables: {errorTables}</p>
          </div>
        </Card>
      )}

      {!isLoadingTables && !errorTables && availableTables.length === 0 && (
        <Card className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">No sensor tables available.</p>
          </div>
        </Card>
      )}

      {/* Data Table and Import/Export - Conditional rendering based on selectedTable */}
      {selectedTable && !isLoadingTables && !errorTables && availableTables.length > 0 && (
        <div className="space-y-6">
          <Card className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Sensor Data</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ImportButton tableName={selectedTable} onClick={() => setIsImportModalOpen(true)} />
                <ExportButton tableName={selectedTable} />
              </div>
            </div>
            
            <CardContent className="p-0">
              <SensorDataTable tableName={selectedTable} />
            </CardContent>
          </Card>

          {/* DataImportModal component */}
          <DataImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            tableName={selectedTable}
          />
        </div>
      )}
    </div>
  );
} 