"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hooks"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const oilChangeRecords = useAppSelector((state) => state.oilChange.records)

  // Calculate vehicles with less than 100 hours remaining
  const urgentVehicles = oilChangeRecords.filter((record) => {
    const hoursSinceChange = record.currentHours - record.lastChangedHours
    const hoursRemaining = record.customInterval - hoursSinceChange
    return hoursRemaining < 100 && hoursRemaining >= 0
  })

  const overdueVehicles = oilChangeRecords.filter((record) => {
    const hoursSinceChange = record.currentHours - record.lastChangedHours
    const hoursRemaining = record.customInterval - hoursSinceChange
    return hoursRemaining < 0
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
                <h4 className="font-semibold text-sm">Oil Change Alerts</h4>
                {overdueVehicles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-destructive">Overdue</p>
                    {overdueVehicles.map((vehicle) => {
                      const hoursSinceChange = vehicle.currentHours - vehicle.lastChangedHours
                      const hoursRemaining = vehicle.customInterval - hoursSinceChange
                      return (
                        <div key={vehicle.id} className="rounded-md bg-destructive/10 p-2 text-xs">
                          <p className="font-medium">{vehicle.vehicleNo}</p>
                          <p className="text-muted-foreground">{Math.abs(hoursRemaining)} hours overdue</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                {urgentVehicles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Less than 100 hours</p>
                    {urgentVehicles.map((vehicle) => {
                      const hoursSinceChange = vehicle.currentHours - vehicle.lastChangedHours
                      const hoursRemaining = vehicle.customInterval - hoursSinceChange
                      return (
                        <div key={vehicle.id} className="rounded-md bg-orange-100 dark:bg-orange-950 p-2 text-xs">
                          <p className="font-medium">{vehicle.vehicleNo}</p>
                          <p className="text-muted-foreground">{hoursRemaining} hours remaining</p>
                        </div>
                      )
                    })}
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
