import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string; // Keep for potential default selection or context
}

// Use direct API URL instead of relying on the Next.js proxy
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

type ImportMethod = 'csv' | 'excel' | 'json';
type JsonImportType = 'paste' | 'file';

const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose, tableName }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<string[]>([]); // State for available tables
  const [selectedTable, setSelectedTable] = useState<string>(''); // State for selected table for import
  const [importMethod, setImportMethod] = useState<ImportMethod>('excel'); // Default to excel
  const [jsonImportType, setJsonImportType] = useState<JsonImportType>('paste'); // Default to paste for JSON

  const { user, token } = useAuth();
  const { toast } = useToast();

  // Fetch available tables when the modal opens or token changes
  useEffect(() => {
    const fetchTables = async () => {
      if (!token) return; // Don't fetch if no token

      try {
        // Use direct API URL
        const response = await fetch(`${API_URL}/api/v1/data/tables`, {
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

        // Optionally set a default selected table if available (e.g., the current page's table)
        if (tableName && data.tables.includes(tableName)) {
            setSelectedTable(tableName);
        } else if (data.tables.length > 0) {
            setSelectedTable(data.tables[0]);
        } else {
            setSelectedTable('');
        }

      } catch (err: any) {
        console.error("Error fetching tables:", err);
        // Handle error fetching tables (e.g., display a message)
      }
    };

    if (isOpen && token) { // Fetch tables only when modal is open and token is available
      fetchTables();
    }
    
    // Reset form state when modal opens/closes
    if (!isOpen) {
      setSelectedFile(null);
      setJsonData('');
      setImportStatus(null);
      setError(null);
    }
  }, [isOpen, token, tableName]); // Depend on isOpen, token, and tableName

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setImportStatus(null); // Clear previous status on new file selection
      setError(null); // Clear previous error
    } else {
        setSelectedFile(null);
    }
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(event.target.value);
    setImportStatus(null);
    setError(null);
  };

  const handleImport = async () => {
    // Validation based on import method
    if ((importMethod === 'csv' || importMethod === 'excel') && !selectedFile) {
      setError("Please select a file to import.");
      return;
    }

    if (importMethod === 'json') {
      if (jsonImportType === 'paste' && !jsonData.trim()) {
        setError("Please enter JSON data to import.");
        return;
      }
      if (jsonImportType === 'file' && !selectedFile) {
        setError("Please select a JSON file to import.");
        return;
      }
    }

    if (!selectedTable) {
        setError("Please select a table to import data into.");
        return;
    }

    if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
    }

    setIsImporting(true);
    setImportStatus("Importing...");
    setError(null); // Clear previous error

    const formData = new FormData();
    formData.append("table", selectedTable);

    if (importMethod === 'json' && jsonImportType === 'paste') {
      // For JSON pasted in textarea, create a file from the text input
      try {
        // Validate JSON first
        JSON.parse(jsonData);
        
        // Create a Blob and File from the JSON string
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonFile = new File([jsonBlob], 'data.json', { type: 'application/json' });
        formData.append("file", jsonFile);
      } catch (e) {
        setError("Invalid JSON format. Please check your input.");
        setIsImporting(false);
        return;
      }
    } else {
      // For CSV, Excel, or JSON file upload, use the selected file
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
    }

    try {
      // Use direct API URL
      const response = await fetch(`${API_URL}/api/v1/data/import`, {
        method: 'POST',
        headers: {
           'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Import failed.");
      }

      const result = await response.json();
      setImportStatus(result.message || "Import successful.");
      toast({
        title: "Import Successful",
        description: result.message || "Data imported successfully.",
      });

      // Reset form after successful import
      if (importMethod === 'json' && jsonImportType === 'paste') {
        setJsonData('');
      } else {
        setSelectedFile(null);
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during import.");
      setImportStatus("Import failed.");
       toast({
        title: "Import Failed",
        description: err.message || "An error occurred during data import.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import data into a sensor table using CSV, Excel, or JSON.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Table Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="table-select" className="text-right">
              Select Table
            </Label>
            <Select value={selectedTable} onValueChange={setSelectedTable} disabled={availableTables.length === 0}>
              <SelectTrigger id="table-select" className="col-span-3">
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {availableTables.length > 0 ? (
                  availableTables.map((table) => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-tables" disabled>No tables available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Import Method Tabs */}
          <Tabs defaultValue="excel" value={importMethod} onValueChange={(value) => setImportMethod(value as ImportMethod)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="excel">Excel</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            
            {/* Excel Tab Content */}
            <TabsContent value="excel">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="excel-file" className="text-right">
                  Excel File
                </Label>
                <Input 
                  id="excel-file" 
                  type="file" 
                  className="col-span-3" 
                  onChange={handleFileChange} 
                  accept=".xls,.xlsx" 
                />
              </div>
              {selectedFile && importMethod === 'excel' && (
                <p className="text-sm text-gray-500 text-right mt-2">Selected file: {selectedFile.name}</p>
              )}
            </TabsContent>
            
            {/* CSV Tab Content */}
            <TabsContent value="csv">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="csv-file" className="text-right">
                  CSV File
                </Label>
                <Input 
                  id="csv-file" 
                  type="file" 
                  className="col-span-3" 
                  onChange={handleFileChange} 
                  accept=".csv" 
                />
              </div>
              {selectedFile && importMethod === 'csv' && (
                <p className="text-sm text-gray-500 text-right mt-2">Selected file: {selectedFile.name}</p>
              )}
            </TabsContent>
            
            {/* JSON Tab Content */}
            <TabsContent value="json">
              <div className="space-y-4">
                <RadioGroup 
                  value={jsonImportType} 
                  onValueChange={(value) => {
                    setJsonImportType(value as JsonImportType);
                    // Clear any existing file or JSON data when switching between options
                    if (value === 'paste') setSelectedFile(null);
                    if (value === 'file') setJsonData('');
                  }}
                  className="flex space-x-4 mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paste" id="paste" />
                    <Label htmlFor="paste">Paste JSON</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file">Upload JSON File</Label>
                  </div>
                </RadioGroup>

                {jsonImportType === 'paste' ? (
                  <div className="grid gap-2">
                    <Label htmlFor="json-data">JSON Data</Label>
                    <Textarea 
                      id="json-data" 
                      placeholder="Paste your JSON data here..." 
                      className="min-h-[200px] font-mono text-sm"
                      value={jsonData}
                      onChange={handleJsonChange}
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="json-file">JSON File</Label>
                    <Input 
                      id="json-file" 
                      type="file" 
                      onChange={handleFileChange} 
                      accept=".json" 
                    />
                    {selectedFile && importMethod === 'json' && jsonImportType === 'file' && (
                      <p className="text-sm text-gray-500 mt-2">Selected file: {selectedFile.name}</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Status and Error Messages */}
          {importStatus && <p className="text-sm text-blue-600">{importStatus}</p>}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={
              (importMethod === 'csv' || importMethod === 'excel') && !selectedFile || 
              (importMethod === 'json' && jsonImportType === 'paste' && !jsonData.trim()) || 
              (importMethod === 'json' && jsonImportType === 'file' && !selectedFile) || 
              !selectedTable || 
              isImporting
            }
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataImportModal; 