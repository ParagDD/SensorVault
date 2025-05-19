"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ExportButtonProps = {
  tableName: string
}

export default function ExportButton({ tableName }: ExportButtonProps) {
  const { toast } = useToast()
  const { token } = useAuth()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: string) => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to export data.",
        variant: "destructive",
      })
      return
    }

    if (!tableName) {
      toast({
        title: "Export Error",
        description: "No table selected for export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    toast({
      title: "Export started",
      description: `Exporting ${tableName} data to ${format.toUpperCase()}...`,
    })

    try {
      // Create a URL for the export endpoint
      const url = `http://localhost:8000/api/v1/data/export?table=${encodeURIComponent(tableName)}&format=${format}`
      
      // For JSON format, we'll fetch the data and display it in a new tab
      if (format === 'json') {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        
        if (!response.ok) {
          throw new Error(`Export failed: ${response.statusText}`)
        }
        
        // For JSON, open the data in a new tab
        const data = await response.json()
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const dataUrl = URL.createObjectURL(blob)
        window.open(dataUrl, '_blank')
      } else {
        // For CSV and Excel, trigger a file download
        const a = document.createElement('a')
        a.href = url
        a.download = `${tableName}.${format === 'excel' ? 'xlsx' : format}`
        
        // Add the token to the request
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        
        // Use fetch to get the file with authentication
        const response = await fetch(url, {
          headers: headers,
        })
        
        if (!response.ok) {
          throw new Error(`Export failed: ${response.statusText}`)
        }
        
        // Get the blob from the response
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        
        // Update the link and trigger the download
        a.href = objectUrl
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objectUrl)
      }

      toast({
        title: "Export complete",
        description: `${tableName} data has been exported to ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" />
          Export Data
    </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
