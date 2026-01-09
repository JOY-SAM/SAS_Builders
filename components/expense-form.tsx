"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Plus, Check, ChevronsUpDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addExpense } from "@/lib/store/slices/expenseSlice"
import { cn } from "@/lib/utils"

import axios from "@/lib/axios"

interface Vehicle {
  id: number
  number: string
}

interface Driver {
  id: number
  name: string
  phoneNumber: string
}

interface ExpenseFormProps {
  trigger?: React.ReactNode
  vehicles: Vehicle[]
  drivers: Driver[]
  onSuccess?: () => void
}

export function ExpenseForm({ trigger, vehicles = [], drivers = [], onSuccess }: ExpenseFormProps) {
  const dispatch = useAppDispatch()
  
  const [open, setOpen] = useState(false)
  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [driverOpen, setDriverOpen] = useState(false)

  // Get current date and time
  const now = new Date()
  const currentDate = now.toISOString().split("T")[0]
  const currentTime = now.toTimeString().slice(0, 5)

  const [formData, setFormData] = useState({
    vehicleNo: "",
    driver: "",
    driverPhone: "",
    date: currentDate,
    time: currentTime,
    description: "",
    category: "",
    amount: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // No longer inferring from expenses, using props instead
  const vehicleOptions = useMemo(() => {
    return vehicles.map(v => v.number)
  }, [vehicles])

  const driverOptions = useMemo(() => {
    return drivers.map(d => [d.name, d.phoneNumber] as [string, string])
  }, [drivers])

  const categories = ["Fuel", "Maintenance", "Toll", "Parking", "Oil Change", "Repairs", "Other"]

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.vehicleNo) newErrors.vehicleNo = "Vehicle is required"
    if (!formData.driver) newErrors.driver = "Driver is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.amount) newErrors.amount = "Amount is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const selectedVehicle = vehicles.find(v => v.number === formData.vehicleNo)
      const selectedDriver = drivers.find(d => d.name === formData.driver)

      if (!selectedVehicle || !selectedDriver) {
         console.error("Vehicle or Driver not found")
         return
      }

      // Combine date and time
      const expenseTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()

      const payload = {
        userId: selectedDriver.id,
        vehicleId: selectedVehicle.id,
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        description: formData.description || formData.category, // Use category as description fallback
        expenseTime: expenseTime
      }

      await axios.post("/api/v1/expenses", payload)

      if (onSuccess) {
        onSuccess()
      }

      // Reset form
      setFormData({
        vehicleNo: "",
        driver: "",
        driverPhone: "",
        date: currentDate,
        time: currentTime,
        description: "",
        category: "",
        amount: "",
      })
      setErrors({})
      setOpen(false)

    } catch (error) {
      console.error("Failed to create expense:", error)
    }
  }

  const handleDriverSelect = (driverName: string) => {
    setFormData((prev) => ({ ...prev, driver: driverName }))
    const driver = drivers.find((d) => d.name === driverName)
    if (driver) {
      setFormData((prev) => ({ ...prev, driverPhone: driver.phoneNumber }))
    }
    setDriverOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Expense</DialogTitle>
            <DialogDescription>Add a new vehicle expense record. Fill in all required fields.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>
                  Vehicle No <span className="text-destructive">*</span>
                </FieldLabel>
                <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={vehicleOpen}
                      className={cn(
                        "w-full justify-between bg-transparent",
                        errors.vehicleNo && "border-destructive ring-destructive"
                      )}
                    >
                      {formData.vehicleNo || "Search and select vehicle..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search vehicle..." />
                      <CommandList>
                        <CommandEmpty>No vehicle found.</CommandEmpty>
                        <CommandGroup>
                          {vehicleOptions.map((vehicle) => (
                            <CommandItem
                              key={vehicle}
                              value={vehicle}
                              onSelect={(value) => {
                                setFormData((prev) => ({ ...prev, vehicleNo: value }))
                                if (errors.vehicleNo) {
                                  setErrors(prev => ({ ...prev, vehicleNo: "" }))
                                }
                                setVehicleOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.vehicleNo === vehicle ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {vehicle}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.vehicleNo && <p className="text-xs text-destructive mt-1">{errors.vehicleNo}</p>}
              </Field>

              <Field>
                <FieldLabel>
                  Driver <span className="text-destructive">*</span>
                </FieldLabel>
                <Popover open={driverOpen} onOpenChange={setDriverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={driverOpen}
                      className={cn(
                        "w-full justify-between bg-transparent",
                        errors.driver && "border-destructive ring-destructive"
                      )}
                    >
                      {formData.driver || "Search and select driver..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search driver..." />
                      <CommandList>
                        <CommandEmpty>No driver found.</CommandEmpty>
                        <CommandGroup>
                          {driverOptions.map(([name, phone]) => (
                            <CommandItem key={name} value={name} onSelect={() => {
                              handleDriverSelect(name)
                              if (errors.driver) {
                                setErrors(prev => ({ ...prev, driver: "" }))
                              }
                            }}>
                              <Check
                                className={cn("mr-2 h-4 w-4", formData.driver === name ? "opacity-100" : "opacity-0")}
                              />
                              <div className="flex flex-col">
                                <span>{name}</span>
                                <span className="text-xs text-muted-foreground">{phone}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.driver && <p className="text-xs text-destructive mt-1">{errors.driver}</p>}
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>
                  Date <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  className={cn(errors.date && "border-destructive")}
                />
                {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
              </Field>

              <Field>
                <FieldLabel>
                  Time <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  required
                  className={cn(errors.time && "border-destructive")}
                />
                {errors.time && <p className="text-xs text-destructive mt-1">{errors.time}</p>}
              </Field>
            </div>

            <Field>
              <FieldLabel>
                Category <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, category: value }))
                  if (errors.category) {
                    setErrors(prev => ({ ...prev, category: "" }))
                  }
                }}
                required
              >
                <SelectTrigger className={cn(errors.category && "border-destructive ring-destructive")}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter expense description"
              />
            </Field>

            <Field>
              <FieldLabel>
                Amount (₹) <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
                className={cn(errors.amount && "border-destructive")}
              />
               {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
