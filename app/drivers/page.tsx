"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { X, Pencil, Trash2 } from "lucide-react"
import { DriverForm, type Driver } from "@/components/driver-form"
import api from "@/lib/axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({ name: "", phoneNumber: "" })

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/api/v1/drivers")
      setDrivers(response.data)
    } catch (error) {
      console.error("Failed to fetch drivers:", error)
      alert("Failed to load drivers. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesName =
        !filters.name || driver.name.toLowerCase().includes(filters.name.toLowerCase())
      const matchesPhone =
        !filters.phoneNumber || driver.phoneNumber.toLowerCase().includes(filters.phoneNumber.toLowerCase())

      return matchesName && matchesPhone
    })
  }, [drivers, filters])

  const hasActiveFilters = filters.name !== "" || filters.phoneNumber !== ""

  // const handleDelete = async (id: string) => {
  //   try {
  //     await api.delete(`/api/v1/drivers/${id}`)
  //     fetchDrivers()
  //   } catch (error) {
  //     console.error("Failed to delete driver:", error)
  //     alert("Failed to delete driver. Please try again.")
  //   }
  // }

  const clearFilters = () => {
    setFilters({ name: "", phoneNumber: "" })
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Drivers Dashboard</CardTitle>
              <CardDescription>Manage all drivers and their contact information</CardDescription>
            </div>
            <DriverForm onSuccess={fetchDrivers} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  type="text"
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Search by name..."
                />
              </Field>

              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  type="text"
                  value={filters.phoneNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Search by phone..."
                />
              </Field>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Drivers</CardDescription>
                <CardTitle className="text-2xl">{drivers.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Drivers</CardDescription>
                <CardTitle className="text-2xl">{drivers.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Filtered Results</CardDescription>
                <CardTitle className="text-2xl">{filteredDrivers.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={3} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.phoneNumber}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DriverForm
                            mode="edit"
                            existingDriver={driver}
                            onSuccess={fetchDrivers}
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          {/* <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {driver.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(driver.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No drivers found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
