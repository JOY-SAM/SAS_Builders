"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus } from "lucide-react"
import api from "@/lib/axios"

interface Vehicle {
  id: number
  number: string
  name: string
  category: string
  oilChangeIntervalHours: number
  description: string
  oilLastChangedHour?: number
  totalHoursRan?: number
  createdAt?: string
}

const categories = ["Excavator", "Bulldozer", "Loader", "Dump Truck", "Grader", "Roller", "Crane", "Forklift", "Other"]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    category: "",
    oilChangeIntervalHours: "",
    description: "",
  })

  const fetchVehicles = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/api/v1/vehicles")
      setVehicles(response.data)
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle)
      setFormData({
        number: vehicle.number,
        name: vehicle.name,
        category: vehicle.category,
        oilChangeIntervalHours: vehicle.oilChangeIntervalHours.toString(),
        description: vehicle.description,
      })
    } else {
      setEditingVehicle(null)
      setFormData({
        number: "",
        name: "",
        category: "",
        oilChangeIntervalHours: "",
        description: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingVehicle(null)
    setFormData({
      number: "",
      name: "",
      category: "",
      oilChangeIntervalHours: "",
      description: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        number: formData.number,
        name: formData.name,
        category: formData.category,
        oilChangeIntervalHours: Number(formData.oilChangeIntervalHours),
        description: formData.description,
        oilLastChangedHour: 0,
        totalHoursRan: 0,
      }

      if (editingVehicle) {
        // Update existing vehicle
        await api.patch(`/api/v1/vehicles/${editingVehicle.id}`, payload)
      } else {
        // Add new vehicle
        await api.post("/api/v1/vehicles", payload)
      }
      
      fetchVehicles()
      handleCloseDialog()
    } catch (error) {
      console.error("Failed to save vehicle:", error)
      alert("Failed to save vehicle. Please try again.")
    }
  }

  // const handleDelete = (id: number) => {
  //   if (confirm("Are you sure you want to delete this vehicle?")) {
  //     // setVehicles(vehicles.filter((v) => v.id !== id))
  //     // API endpoint pending
  //   }
  // }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Vehicle Management</CardTitle>
              <CardDescription>Manage your fleet of vehicles and equipment</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Oil Change Interval (hrs)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading vehicles...
                    </TableCell>
                  </TableRow>
                ) : vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No vehicles found. Add your first vehicle to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.number}</TableCell>
                      <TableCell>{vehicle.name}</TableCell>
                      <TableCell>{vehicle.category}</TableCell>
                      <TableCell>{vehicle.oilChangeIntervalHours}</TableCell>
                      <TableCell className="max-w-xs truncate">{vehicle.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(vehicle)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update the vehicle information below"
                : "Fill in the details to add a new vehicle to your fleet"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Vehicle Number *</Label>
                  <Input
                    id="number"
                    placeholder="V001"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name *</Label>
                <Input
                  id="name"
                  placeholder="CAT 320 Excavator"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oil_change">Oil Change Interval (hours) *</Label>
                <Input
                  id="oil_change"
                  type="number"
                  placeholder="250"
                  min="1"
                  value={formData.oilChangeIntervalHours}
                  onChange={(e) => setFormData({ ...formData, oilChangeIntervalHours: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter vehicle description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingVehicle ? "Update Vehicle" : "Add Vehicle"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
