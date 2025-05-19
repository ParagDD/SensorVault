"use client"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

type ImportButtonProps = {
  tableName: string
  onClick: () => void
}

export default function ImportButton({ tableName, onClick }: ImportButtonProps) {
  return (
    <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClick}>
          <Upload className="mr-2 h-4 w-4" />
          Import Data
        </Button>
  )
}
