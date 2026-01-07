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

interface ExpenseFormProps {
  trigger?: React.ReactNode
}

export function ExpenseForm({ trigger }: ExpenseFormProps) {
  const dispatch = useAppDispatch()
  const expenses = useAppSelector((state) => state.expenses.expenses)

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

  const vehicleOptions = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.vehicleNo)))
  }, [expenses])

  const driverOptions = useMemo(() => {
    const driversMap = new Map<string, string>()
    expenses.forEach((e) => {
      if (!driversMap.has(e.driver)) {
        driversMap.set(e.driver, e.driverPhone)
      }
    })
    return Array.from(driversMap.entries())
  }, [expenses])

  const categories = ["Fuel", "Maintenance", "Toll", "Parking", "Oil Change", "Repairs", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Find driver phone if driver is selected from dropdown
    let driverPhone = formData.driverPhone
    if (!driverPhone && formData.driver) {
      const existingDriver = expenses.find((exp) => exp.driver === formData.driver)
      driverPhone = existingDriver?.driverPhone || ""
    }

    const newExpense = {
      id: Date.now().toString(),
      vehicleNo: formData.vehicleNo,
      driver: formData.driver,
      driverPhone: driverPhone,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
    }

    dispatch(addExpense(newExpense))

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
    setOpen(false)
  }

  const handleDriverSelect = (driverName: string) => {
    setFormData((prev) => ({ ...prev, driver: driverName }))
    const driver = driverOptions.find(([name]) => name === driverName)
    if (driver) {
      setFormData((prev) => ({ ...prev, driverPhone: driver[1] }))
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
                      className="w-full justify-between bg-transparent"
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
                      className="w-full justify-between bg-transparent"
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
                            <CommandItem key={name} value={name} onSelect={() => handleDriverSelect(name)}>
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
                />
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
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>
                Category <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
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
              />
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
