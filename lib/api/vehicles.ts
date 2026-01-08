import axiosInstance from "./axios-instance"

export interface Vehicle {
  id?: number
  number: string
  name: string
  category: string
  oilLastChanged: string
  oilChangeIntervalHours: number
  totalHoursRan: number
  description: string
  createdAt?: string
}

export interface CreateVehicleDto {
  number: string
  name: string
  category: string
  oilLastChanged: string
  oilChangeIntervalHours: number
  totalHoursRan: number
  description: string
}

export interface UpdateVehicleDto {
  number?: string
  name?: string
  category?: string
  oilLastChanged?: string
  oilChangeIntervalHours?: number
  totalHoursRan?: number
  description?: string
}

// Create a new vehicle
export const createVehicle = async (data: CreateVehicleDto): Promise<Vehicle> => {
  const response = await axiosInstance.post<Vehicle>("/api/v1/vehicles", data)
  return response.data
}

// Get all vehicles
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const response = await axiosInstance.get<Vehicle[]>("/api/v1/vehicles")
  return response.data
}

// Get a vehicle by ID
export const getVehicleById = async (id: number): Promise<Vehicle> => {
  const response = await axiosInstance.get<Vehicle>(`/api/v1/vehicles/${id}`)
  return response.data
}

// Update a vehicle
export const updateVehicle = async (id: number, data: UpdateVehicleDto): Promise<Vehicle> => {
  const response = await axiosInstance.patch<Vehicle>(`/api/v1/vehicles/${id}`, data)
  return response.data
}

// Delete a vehicle (if needed in the future)
export const deleteVehicle = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/vehicles/${id}`)
}
