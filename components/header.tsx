"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()

  // Don't show sidebar toggle on login page
  const isLoginPage = pathname === "/login"

  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href={user ? "/dashboard" : "/login"} className="flex items-center">
            <span className="text-xl font-bold text-teal-600">Sensor Monitor</span>
          </Link>
        </div>

        {!isLoading && user && (
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{user?.phoneNumber}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/settings" className="flex w-full items-center">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {!isLoading && user && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>

      {!isLoading && user && mobileMenuOpen && (
        <div className="border-t p-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/data/Activity"
              className="text-gray-600 hover:text-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recent Activity
            </Link>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <Button
              variant="ghost"
              className="justify-start px-0 text-red-600 hover:text-red-700"
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
