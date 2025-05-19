"use client"

import React, { useState, useEffect } from 'react';
import SensorDataTable from "@/components/sensor-data-table"
import Filters from "@/components/filters"
import ExportButton from "@/components/export-button"
import ImportButton from "@/components/import-button"
import SensorChart from "@/components/chart"
import DataImportModal from "@/components/DataImportModal";

interface SensorTableClientProps {
  tableName: string;
}

export default function SensorTableClient({ tableName }: SensorTableClientProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
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
    </>
  );
} 