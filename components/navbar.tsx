"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import api from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export interface OilExpenseStatusEntity {
  vehicleNo: string
  status: string
  hoursLeft: number
  lastChangedOn: number
  currentHours: number
  oilChangeInterval: number
  vehicleId: number
}

export function Navbar() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<OilExpenseStatusEntity[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get<OilExpenseStatusEntity[]>("/api/v1/oil-expense/oil_change/notification")
        setNotifications(response.data)
      } catch (error) {
        console.error("Failed to fetch oil change notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  // Calculate vehicles with less than 100 hours remaining (but not overdue yet)
  const urgentVehicles = notifications.filter((record) => {
    return record.hoursLeft < 100 && record.hoursLeft >= 0
  })

  // Calculate overdue vehicles
  const overdueVehicles = notifications.filter((record) => {
    return record.hoursLeft < 0
  })

  const totalNotifications = urgentVehicles.length + overdueVehicles.length

  const links = [
    { href: "/expenses", label: "Expenses" },
    { href: "/oil-change", label: "Oil Change" },
    { href: "/vehicles", label: "Vehicles" },
    { href: "/drivers", label: "Drivers" },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/SAS_icon.jpg" alt="SAS Builders Logo" width={32} height={32} className="rounded-md" />
          <span className="text-lg font-semibold">SAS Builders</span>
        </Link>

        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {totalNotifications > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm">Oil Change Alerts</span>
                <Badge variant="destructive" className="h-5 min-w-5 px-1">
                  {totalNotifications}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-3">
                <h4 className="border-b pb-2 text-sm font-semibold">Oil Change Alerts</h4>
                {overdueVehicles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-destructive">Overdue</p>
                    {overdueVehicles.map((vehicle) => (
                      <div key={vehicle.vehicleId} className="rounded-md bg-destructive/10 p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{vehicle.vehicleNo}</span>
                          <span className="font-medium text-destructive">
                            {Math.abs(vehicle.hoursLeft)} hrs overdue
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between text-muted-foreground">
                          <span>Current: {vehicle.currentHours}h</span>
                          <span>Interval: {vehicle.oilChangeInterval}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {urgentVehicles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Due Soon</p>
                    {urgentVehicles.map((vehicle) => (
                      <div key={vehicle.vehicleId} className="rounded-md bg-orange-100 p-2 text-xs dark:bg-orange-950">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{vehicle.vehicleNo}</span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            {vehicle.hoursLeft} hrs left
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between text-muted-foreground">
                          <span>Current: {vehicle.currentHours}h</span>
                          <span>Interval: {vehicle.oilChangeInterval}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  )
}
