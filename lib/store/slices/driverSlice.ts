import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Driver {
  id: number
  name: string
  phoneNumber: string
}

export interface DriverFilters {
  name: string
  phoneNumber: string
}

interface DriverState {
  drivers: Driver[]
  filters: DriverFilters
}

const initialState: DriverState = {
  drivers: [],
  filters: {
    name: "",
    phoneNumber: "",
  },
}

const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.drivers = action.payload
    },
    addDriver: (state, action: PayloadAction<Driver>) => {
      state.drivers.push(action.payload)
    },
    updateDriver: (state, action: PayloadAction<Driver>) => {
      const index = state.drivers.findIndex((driver) => driver.id === action.payload.id)
      if (index !== -1) {
        state.drivers[index] = action.payload
      }
    },
    deleteDriver: (state, action: PayloadAction<number>) => {
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

export const { setDrivers, addDriver, updateDriver, deleteDriver, setFilter, clearFilters } = driverSlice.actions

export default driverSlice.reducer
