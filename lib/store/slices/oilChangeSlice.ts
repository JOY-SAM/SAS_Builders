import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface OilChangeRecord {
  id: string
  vehicleNo: string
  lastChangedDate: string
  lastChangedHours: number // Engine hours at last oil change
  currentHours: number // Current engine hours
  customInterval: number // Hours between oil changes (default 250)
  driver?: string
}

interface OilChangeState {
  records: OilChangeRecord[]
}

const initialState: OilChangeState = {
  records: [
    {
      id: "1",
      vehicleNo: "MH-12-AB-1234",
      lastChangedDate: "2024-12-15",
      lastChangedHours: 5000,
      currentHours: 5180,
      customInterval: 250,
      driver: "Rajesh Kumar",
    },
    {
      id: "2",
      vehicleNo: "MH-12-CD-5678",
      lastChangedDate: "2024-12-20",
      lastChangedHours: 3200,
      currentHours: 3280,
      customInterval: 300,
      driver: "Amit Sharma",
    },
    {
      id: "3",
      vehicleNo: "MH-12-EF-9012",
      lastChangedDate: "2024-11-10",
      lastChangedHours: 7500,
      currentHours: 7750,
      customInterval: 250,
      driver: "Suresh Patil",
    },
    {
      id: "4",
      vehicleNo: "KA-05-MN-7890",
      lastChangedDate: "2024-01-05",
      lastChangedHours: 4200,
      currentHours: 4485,
      customInterval: 300,
      driver: "Prakash Singh",
    },
  ],
}

const oilChangeSlice = createSlice({
  name: "oilChange",
  initialState,
  reducers: {
    addOilChangeRecord: (state, action: PayloadAction<OilChangeRecord>) => {
      state.records.push(action.payload)
    },
    updateOilChangeRecord: (state, action: PayloadAction<OilChangeRecord>) => {
      const index = state.records.findIndex((record) => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index] = action.payload
      }
    },
    updateCustomInterval: (state, action: PayloadAction<{ id: string; interval: number }>) => {
      const index = state.records.findIndex((record) => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index].customInterval = action.payload.interval
      }
    },
    updateCurrentHours: (state, action: PayloadAction<{ id: string; hours: number }>) => {
      const index = state.records.findIndex((record) => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index].currentHours = action.payload.hours
      }
    },
    recordOilChange: (state, action: PayloadAction<{ id: string; date: string; currentHours: number }>) => {
      const index = state.records.findIndex((record) => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index].lastChangedDate = action.payload.date
        state.records[index].lastChangedHours = action.payload.currentHours
        state.records[index].currentHours = action.payload.currentHours
      }
    },
    deleteOilChangeRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((record) => record.id !== action.payload)
    },
  },
})

export const {
  addOilChangeRecord,
  updateOilChangeRecord,
  updateCustomInterval,
  updateCurrentHours,
  recordOilChange,
  deleteOilChangeRecord,
} = oilChangeSlice.actions

export default oilChangeSlice.reducer
