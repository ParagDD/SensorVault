"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Database, Settings, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Recent Activity",
    href: "/activity",
    icon: Activity,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-white md:block">
      <nav className="flex flex-col p-4">
        <div className="py-2 text-xs font-semibold uppercase text-gray-500">Main Menu</div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100",
                  (pathname === item.href) &&
                    "bg-teal-50 text-teal-700",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
