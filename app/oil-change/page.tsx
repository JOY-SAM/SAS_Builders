"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import api from "@/lib/axios"

interface OilChangeRecord {
  vehicleId: number
  vehicleNo: string
  status: string
  hoursLeft: number
  lastChangedOn: number // Engine hours
  currentHours: number
  oilChangeInterval: number
}

interface Vehicle {
  id: number
  number: string
  name: string
}

interface Driver {
  id: number
  name: string
}

export default function OilChangePage() {
  const [records, setRecords] = useState<OilChangeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  // New state for adding oil expense
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [oilExpenseForm, setOilExpenseForm] = useState({
    vehicleId: "",
    driverId: "",
    amount: "",
    hours: "",
    description: "",
    expenseTime: new Date().toISOString().slice(0, 16), // Default to now
  })

  const fetchRecords = async () => {
    try {
      const response = await api.get("/api/v1/oil-expense")
      setRecords(response.data)
    } catch (error) {
      console.error("Failed to fetch oil change records:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
    fetchVehicles()
    fetchDrivers()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/api/v1/vehicles")
      setVehicles(response.data)
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await api.get("/api/v1/drivers")
      setDrivers(response.data)
    } catch (error) {
      console.error("Failed to fetch drivers:", error)
    }
  }

  const startEdit = (id: number, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue.toString())
  }

  const saveEdit = async (id: number) => {
    try {
      await api.patch(`/api/v1/oil-expense/${id}`, {
        oilChangeInterval: Number.parseInt(editValue),
      })
      await fetchRecords()
      setEditingId(null)
      setEditValue("")
    } catch (error) {
      console.error("Failed to update interval:", error)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        vehicleId: Number(oilExpenseForm.vehicleId),
        driverId: Number(oilExpenseForm.driverId),
        amount: Number(oilExpenseForm.amount),
        hours: Number(oilExpenseForm.hours),
        description: oilExpenseForm.description,
        expenseTime: new Date(oilExpenseForm.expenseTime).toISOString(),
      }

      await api.post("/api/v1/oil-expense", payload)
      
      // Reset form and close dialog
      setOilExpenseForm({
        vehicleId: "",
        driverId: "",
        amount: "",
        hours: "",
        description: "",
        expenseTime: new Date().toISOString().slice(0, 16),
      })
      setIsDialogOpen(false)
      fetchRecords() // Refresh list
    } catch (error) {
      console.error("Failed to create oil expense:", error)
      alert("Failed to create oil expense. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "overdue":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        )
      case "urgent":
        return (
          <Badge className="gap-1 bg-orange-600 hover:bg-orange-700">
            <AlertCircle className="h-3 w-3" />
            Urgent
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Good
          </Badge>
        )
    }
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Oil Change Dashboard</CardTitle>
              <CardDescription>
                Monitor oil change schedules across all vehicles and track maintenance intervals
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Oil Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Vehicles</CardDescription>
                <CardTitle className="text-2xl">{records.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Overdue</CardDescription>
                <CardTitle className="text-2xl text-destructive">
                  {records.filter((r) => r.status.toLowerCase() === "overdue").length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Urgent (&lt; 100 hrs)</CardDescription>
                <CardTitle className="text-2xl text-orange-600">
                  {records.filter((r) => r.status.toLowerCase() === "urgent").length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Good Status</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {records.filter((r) => r.status.toLowerCase() === "good").length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle No</TableHead>
                  <TableHead>Hours Left</TableHead>
                  <TableHead>Last Changed At (Hrs)</TableHead>
                  <TableHead>Current Hours</TableHead>
                  <TableHead>Oil Change Interval</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : records.length > 0 ? (
                  records
                    .slice()
                    .sort((a, b) => a.hoursLeft - b.hoursLeft)
                    .map((record) => (
                      <TableRow
                        key={record.vehicleId}
                        className={cn(
                          record.status.toLowerCase() === "overdue" && "bg-destructive/5",
                          record.status.toLowerCase() === "urgent" && "bg-orange-50 dark:bg-orange-950/20",
                        )}
                      >
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="font-medium">{record.vehicleNo}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "font-semibold",
                              record.status.toLowerCase() === "overdue" && "text-destructive",
                              record.status.toLowerCase() === "urgent" && "text-orange-600",
                              record.status.toLowerCase() === "good" && "text-green-600",
                            )}
                          >
                            {record.hoursLeft < 0 ? `${Math.abs(record.hoursLeft)} overdue` : `${record.hoursLeft} hrs`}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.lastChangedOn} hrs</TableCell>
                        <TableCell>{record.currentHours} hrs</TableCell>
                        <TableCell>
                          {editingId === record.vehicleId ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 w-24"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => saveEdit(record.vehicleId)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>Every {record.oilChangeInterval} hrs</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => startEdit(record.vehicleId, record.oilChangeInterval)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No oil change records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Oil Expense</DialogTitle>
            <DialogDescription>
              Record an oil change expense and reset the oil change hours for a vehicle.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateExpense}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle *</Label>
                <Select
                  value={oilExpenseForm.vehicleId}
                  onValueChange={(value) => setOilExpenseForm({ ...oilExpenseForm, vehicleId: value })}
                  required
                >
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>
                        {v.number} - {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Driver *</Label>
                <Select
                  value={oilExpenseForm.driverId}
                  onValueChange={(value) => setOilExpenseForm({ ...oilExpenseForm, driverId: value })}
                  required
                >
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="3500"
                    min="0"
                    value={oilExpenseForm.amount}
                    onChange={(e) => setOilExpenseForm({ ...oilExpenseForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Ran *</Label>
                  <Input
                    id="hours"
                    type="number"
                    placeholder="50"
                    min="0"
                    value={oilExpenseForm.hours}
                    onChange={(e) => setOilExpenseForm({ ...oilExpenseForm, hours: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenseTime">Date & Time *</Label>
                <Input
                  id="expenseTime"
                  type="datetime-local"
                  value={oilExpenseForm.expenseTime}
                  onChange={(e) => setOilExpenseForm({ ...oilExpenseForm, expenseTime: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Oil change details..."
                  value={oilExpenseForm.description}
                  onChange={(e) => setOilExpenseForm({ ...oilExpenseForm, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
