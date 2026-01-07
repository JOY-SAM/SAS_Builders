import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Driver {
  id: string
  username: string
  phoneNumber: string
}

export interface DriverFilters {
  username: string
  phoneNumber: string
}

interface DriverState {
  drivers: Driver[]
  filters: DriverFilters
}

const initialState: DriverState = {
  drivers: [
    {
      id: "1",
      username: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
    {
      id: "2",
      username: "Amit Sharma",
      phoneNumber: "+91 98765 43211",
    },
    {
      id: "3",
      username: "Suresh Patil",
      phoneNumber: "+91 98765 43212",
    },
    {
      id: "4",
      username: "Prakash Singh",
      phoneNumber: "+91 98765 43213",
    },
  ],
  filters: {
    username: "",
    phoneNumber: "",
  },
}

const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    addDriver: (state, action: PayloadAction<Driver>) => {
      state.drivers.push(action.payload)
    },
    updateDriver: (state, action: PayloadAction<Driver>) => {
      const index = state.drivers.findIndex((driver) => driver.id === action.payload.id)
      if (index !== -1) {
        state.drivers[index] = action.payload
      }
    },
    deleteDriver: (state, action: PayloadAction<string>) => {
      state.drivers = state.drivers.filter((driver) => driver.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<{ key: keyof DriverFilters; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { addDriver, updateDriver, deleteDriver, setFilter, clearFilters } = driverSlice.actions

export default driverSlice.reducer
