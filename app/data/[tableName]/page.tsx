"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import SensorDataTable from "@/components/sensor-data-table"
import Filters from "@/components/filters"
import ExportButton from "@/components/export-button"
import ImportButton from "@/components/import-button"
import SensorChart from "@/components/chart"
import DataImportModal from "@/components/DataImportModal";
import SensorTableClient from "@/components/sensor-table-client";

type Props = {
  params: { tableName: string }
}

// Removed generateMetadata function as it cannot be in a client component
/*
export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `${decodeURIComponent(params.tableName)} | Sensor Data`,
    description: `View and analyze data from ${decodeURIComponent(params.tableName)} sensor`,
  }
}
*/

export default function SensorTablePage({ params }: Props) {
  const tableName = decodeURIComponent(params.tableName)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-teal-600">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{tableName}</span>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">{tableName}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Filters />
          <div className="flex gap-2">
            <ImportButton tableName={tableName} onClick={() => setIsImportModalOpen(true)} />
            <ExportButton tableName={tableName} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Recent Trends</h2>
        <SensorChart tableName={tableName} />
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Sensor Data</h2>
        <SensorDataTable tableName={tableName} />
      </div>

      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        tableName={tableName}
      />
    </div>
  )
}
