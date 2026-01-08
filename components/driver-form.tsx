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
import { useAppDispatch } from "@/lib/store/hooks"
import { addDriver, updateDriver } from "@/lib/store/slices/driverSlice"
import type { Driver } from "@/lib/store/slices/driverSlice"

interface DriverFormProps {
  trigger?: React.ReactNode
  existingDriver?: Driver
  mode?: "create" | "edit"
}

export function DriverForm({ trigger, existingDriver, mode = "create" }: DriverFormProps) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    username: existingDriver?.username || "",
    phoneNumber: existingDriver?.phoneNumber || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "edit" && existingDriver) {
      const updatedDriver: Driver = {
        id: existingDriver.id,
        username: formData.username,
        phoneNumber: formData.phoneNumber,
      }
      dispatch(updateDriver(updatedDriver))
    } else {
      const newDriver: Driver = {
        id: Date.now().toString(),
        username: formData.username,
        phoneNumber: formData.phoneNumber,
      }
      dispatch(addDriver(newDriver))
    }

    // Reset form
    setFormData({
      username: "",
      phoneNumber: "",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Edit Driver" : "Add New Driver"}</DialogTitle>
            <DialogDescription>
              {mode === "edit" ? "Update driver information below." : "Add a new driver to the system."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel>
                Username <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter driver name"
                required
              />
            </Field>

            <Field>
              <FieldLabel>
                Phone Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === "edit" ? "Update Driver" : "Add Driver"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
