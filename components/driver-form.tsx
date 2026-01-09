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
import api from "@/lib/axios"

export interface Driver {
  id: string
  name: string
  phoneNumber: string
}

interface DriverFormProps {
  trigger?: React.ReactNode
  existingDriver?: Driver
  mode?: "create" | "edit"
  onSuccess?: () => void
}

export function DriverForm({ trigger, existingDriver, mode = "create", onSuccess }: DriverFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: existingDriver?.name || "",
    phoneNumber: existingDriver?.phoneNumber || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "edit" && existingDriver) {
        await api.patch(`/api/v1/drivers/${existingDriver.id}`, {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        })
      } else {
        await api.post("/api/v1/drivers", {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        })
      }

      setFormData({
        name: "",
        phoneNumber: "",
      })
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save driver:", error)
      alert("Failed to save driver. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : mode === "edit" ? "Update Driver" : "Add Driver"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
