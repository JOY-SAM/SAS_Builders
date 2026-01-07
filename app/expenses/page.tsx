"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setFilter, clearFilters } from "@/lib/store/slices/expenseSlice"
import { ExpenseForm } from "@/components/expense-form"

export default function ExpensesPage() {
  const dispatch = useAppDispatch()
  const expenses = useAppSelector((state) => state.expenses.expenses)
  const filters = useAppSelector((state) => state.expenses.filters)

  const uniqueVehicles = useMemo(() => Array.from(new Set(expenses.map((e) => e.vehicleNo))), [expenses])
  const uniqueDrivers = useMemo(() => Array.from(new Set(expenses.map((e) => e.driver))), [expenses])
  const uniqueCategories = useMemo(() => Array.from(new Set(expenses.map((e) => e.category))), [expenses])

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesVehicle = filters.vehicleNo === "all" || expense.vehicleNo === filters.vehicleNo
      const matchesDriver = filters.driver === "all" || expense.driver === filters.driver

      // Date range filtering
      const expenseDate = new Date(expense.date)
      const matchesDateFrom = !filters.dateFrom || expenseDate >= new Date(filters.dateFrom)
      const matchesDateTo = !filters.dateTo || expenseDate <= new Date(filters.dateTo)

      const matchesDescription =
        !filters.description || expense.description.toLowerCase().includes(filters.description.toLowerCase())
      const matchesCategory = filters.category === "all" || expense.category === filters.category
      const matchesAmount = !filters.amount || expense.amount.toString().includes(filters.amount)

      return (
        matchesVehicle &&
        matchesDriver &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesDescription &&
        matchesCategory &&
        matchesAmount
      )
    })
  }, [expenses, filters])

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [filteredExpenses])

  const hasActiveFilters =
    filters.vehicleNo !== "all" ||
    filters.driver !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.description !== "" ||
    filters.category !== "all" ||
    filters.amount !== ""

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Vehicle Expense Dashboard</CardTitle>
              <CardDescription>Track and manage expenses across all vehicles and drivers</CardDescription>
            </div>
            <ExpenseForm />
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field>
                <FieldLabel>Vehicle No</FieldLabel>
                <Select
                  value={filters.vehicleNo}
                  onValueChange={(value) => dispatch(setFilter({ key: "vehicleNo", value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All vehicles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    {uniqueVehicles.map((vehicle) => (
                      <SelectItem key={vehicle} value={vehicle}>
                        {vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Driver</FieldLabel>
                <Select value={filters.driver} onValueChange={(value) => dispatch(setFilter({ key: "driver", value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All drivers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drivers</SelectItem>
                    {uniqueDrivers.map((driver) => (
                      <SelectItem key={driver} value={driver}>
                        {driver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={filters.category}
                  onValueChange={(value) => dispatch(setFilter({ key: "category", value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>
                  From Date <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => dispatch(setFilter({ key: "dateFrom", value: e.target.value }))}
                  placeholder="Start date"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>
                  To Date <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => dispatch(setFilter({ key: "dateTo", value: e.target.value }))}
                  placeholder="End date"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  type="text"
                  value={filters.description}
                  onChange={(e) => dispatch(setFilter({ key: "description", value: e.target.value }))}
                  placeholder="Search description..."
                />
              </Field>

              <Field>
                <FieldLabel>Amount</FieldLabel>
                <Input
                  type="text"
                  value={filters.amount}
                  onChange={(e) => dispatch(setFilter({ key: "amount", value: e.target.value }))}
                  placeholder="Filter by amount..."
                />
              </Field>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl">₹{totalAmount.toLocaleString("en-IN")}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Number of Records</CardDescription>
                <CardTitle className="text-2xl">{filteredExpenses.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Vehicles</CardDescription>
                <CardTitle className="text-2xl">{new Set(filteredExpenses.map((e) => e.vehicleNo)).size}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle No</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.vehicleNo}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{expense.driver}</span>
                          <span className="text-sm text-muted-foreground">{expense.driverPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.time}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{expense.amount.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No expenses found matching the current filters.
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
