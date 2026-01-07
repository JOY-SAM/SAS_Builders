"use client"

import type React from "react"
import { useState } from "react"
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
import { Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { recordOilChange } from "@/lib/store/slices/oilChangeSlice"
import { addExpense } from "@/lib/store/slices/expenseSlice"

interface OilChangeFormProps {
  vehicleId: string
  vehicleNo: string
  currentHours: number
}

export function OilChangeForm({ vehicleId, vehicleNo, currentHours }: OilChangeFormProps) {
  const dispatch = useAppDispatch()
  const oilChangeRecord = useAppSelector((state) => state.oilChange.records.find((r) => r.id === vehicleId))

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    hoursDriven: "",
    amount: "",
    description: "Oil Change & Filter",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const hoursDriven = formData.hoursDriven ? Number.parseFloat(formData.hoursDriven) : 0
    const newTotalHours = hoursDriven > 0 ? currentHours + hoursDriven : currentHours

    dispatch(
      recordOilChange({
        id: vehicleId,
        date: formData.date,
        currentHours: newTotalHours,
      }),
    )

    if (formData.amount && Number.parseFloat(formData.amount) > 0) {
      const newExpense = {
        id: Date.now().toString(),
        vehicleNo: vehicleNo,
        driver: oilChangeRecord?.driver || "",
        driverPhone: "",
        date: formData.date,
        time: formData.time,
        description: formData.description,
        category: "Oil Change",
        amount: Number.parseFloat(formData.amount),
      }

      dispatch(addExpense(newExpense))
    }

    setFormData({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      hoursDriven: "",
      amount: "",
      description: "Oil Change & Filter",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Record Oil Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Oil Change</DialogTitle>
            <DialogDescription>
              Record an oil change for {vehicleNo}. This will be automatically added to the expense log.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
              <FieldLabel>Hours Driven Since Last Change</FieldLabel>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Current engine hours: <span className="font-medium text-foreground">{currentHours} hrs</span>
                </div>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.hoursDriven}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hoursDriven: e.target.value }))}
                  placeholder="Enter hours driven"
                />
                {formData.hoursDriven && (
                  <div className="text-sm text-muted-foreground">
                    New total hours:{" "}
                    <span className="font-medium text-foreground">
                      {(currentHours + Number.parseFloat(formData.hoursDriven || "0")).toFixed(1)} hrs
                    </span>
                  </div>
                )}
              </div>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Oil Change & Filter"
              />
            </Field>

            <Field>
              <FieldLabel>Amount (₹)</FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record & Add to Expenses</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
