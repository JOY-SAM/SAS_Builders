"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { updateCustomInterval, updateCurrentHours } from "@/lib/store/slices/oilChangeSlice"
import { OilChangeForm } from "@/components/oil-change-form"
import { Pencil, Check, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OilChangePage() {
  const dispatch = useAppDispatch()
  const records = useAppSelector((state) => state.oilChange.records)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<"interval" | "hours" | null>(null)
  const [editValue, setEditValue] = useState("")

  const startEdit = (id: string, field: "interval" | "hours", currentValue: number) => {
    setEditingId(id)
    setEditingField(field)
    setEditValue(currentValue.toString())
  }

  const saveEdit = (id: string) => {
    if (editingField === "interval") {
      dispatch(updateCustomInterval({ id, interval: Number.parseInt(editValue) }))
    } else if (editingField === "hours") {
      dispatch(updateCurrentHours({ id, hours: Number.parseFloat(editValue) }))
    }
    setEditingId(null)
    setEditingField(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingField(null)
    setEditValue("")
  }

  const getStatusBadge = (hoursRemaining: number) => {
    if (hoursRemaining < 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>
      )
    } else if (hoursRemaining < 100) {
      return (
        <Badge className="gap-1 bg-orange-600 hover:bg-orange-700">
          <AlertCircle className="h-3 w-3" />
          Urgent
        </Badge>
      )
    } else {
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
          <CardTitle className="text-2xl">Oil Change Dashboard</CardTitle>
          <CardDescription>
            Monitor oil change schedules across all vehicles and track maintenance intervals
          </CardDescription>
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
                  {
                    records.filter((r) => {
                      const hoursSinceChange = r.currentHours - r.lastChangedHours
                      return r.customInterval - hoursSinceChange < 0
                    }).length
                  }
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Urgent (&lt; 100 hrs)</CardDescription>
                <CardTitle className="text-2xl text-orange-600">
                  {
                    records.filter((r) => {
                      const hoursSinceChange = r.currentHours - r.lastChangedHours
                      const remaining = r.customInterval - hoursSinceChange
                      return remaining < 100 && remaining >= 0
                    }).length
                  }
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Good Status</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {
                    records.filter((r) => {
                      const hoursSinceChange = r.currentHours - r.lastChangedHours
                      return r.customInterval - hoursSinceChange >= 100
                    }).length
                  }
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
                  <TableHead>Last Changed On</TableHead>
                  <TableHead>Current Hours</TableHead>
                  <TableHead>Oil Change Interval</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length > 0 ? (
                  records
                    .slice()
                    .sort((a, b) => {
                      // Sort by hours remaining (urgent first)
                      const aRemaining = a.customInterval - (a.currentHours - a.lastChangedHours)
                      const bRemaining = b.customInterval - (b.currentHours - b.lastChangedHours)
                      return aRemaining - bRemaining
                    })
                    .map((record) => {
                      const hoursSinceChange = record.currentHours - record.lastChangedHours
                      const hoursRemaining = record.customInterval - hoursSinceChange

                      return (
                        <TableRow
                          key={record.id}
                          className={cn(
                            hoursRemaining < 0 && "bg-destructive/5",
                            hoursRemaining < 100 && hoursRemaining >= 0 && "bg-orange-50 dark:bg-orange-950/20",
                          )}
                        >
                          <TableCell>{getStatusBadge(hoursRemaining)}</TableCell>
                          <TableCell className="font-medium">{record.vehicleNo}</TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-semibold",
                                hoursRemaining < 0 && "text-destructive",
                                hoursRemaining < 100 && hoursRemaining >= 0 && "text-orange-600",
                                hoursRemaining >= 100 && "text-green-600",
                              )}
                            >
                              {hoursRemaining < 0 ? `${Math.abs(hoursRemaining)} overdue` : `${hoursRemaining} hrs`}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(record.lastChangedDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            {editingId === record.id && editingField === "hours" ? (
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
                                  onClick={() => saveEdit(record.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>{record.currentHours} hrs</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => startEdit(record.id, "hours", record.currentHours)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === record.id && editingField === "interval" ? (
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
                                  onClick={() => saveEdit(record.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>Every {record.customInterval} hrs</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => startEdit(record.id, "interval", record.customInterval)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <OilChangeForm
                              vehicleId={record.id}
                              vehicleNo={record.vehicleNo}
                              currentHours={record.currentHours}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No oil change records found.
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
