"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { X, Pencil, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setFilter, clearFilters, deleteDriver } from "@/lib/store/slices/driverSlice"
import { DriverForm } from "@/components/driver-form"
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
  const dispatch = useAppDispatch()
  const drivers = useAppSelector((state) => state.drivers.drivers)
  const filters = useAppSelector((state) => state.drivers.filters)

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesUsername =
        !filters.username || driver.username.toLowerCase().includes(filters.username.toLowerCase())
      const matchesPhone =
        !filters.phoneNumber || driver.phoneNumber.toLowerCase().includes(filters.phoneNumber.toLowerCase())

      return matchesUsername && matchesPhone
    })
  }, [drivers, filters])

  const hasActiveFilters = filters.username !== "" || filters.phoneNumber !== ""

  const handleDelete = (id: string) => {
    dispatch(deleteDriver(id))
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
            <DriverForm />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={() => dispatch(clearFilters())}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input
                  type="text"
                  value={filters.username}
                  onChange={(e) => dispatch(setFilter({ key: "username", value: e.target.value }))}
                  placeholder="Search by username..."
                />
              </Field>

              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  type="text"
                  value={filters.phoneNumber}
                  onChange={(e) => dispatch(setFilter({ key: "phoneNumber", value: e.target.value }))}
                  placeholder="Search by phone..."
                />
              </Field>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Drivers</CardDescription>
                <CardTitle className="text-2xl">{filteredDrivers.length}</CardTitle>
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
                  <TableHead>Username</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.username}</TableCell>
                      <TableCell>{driver.phoneNumber}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DriverForm
                            mode="edit"
                            existingDriver={driver}
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {driver.username}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(driver.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
