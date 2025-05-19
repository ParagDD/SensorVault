import type React from "react"
import Sidebar from "@/components/sidebar"

export default function DataLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">{children}</main>
    </>
  )
}
