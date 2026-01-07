import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Expense {
  id: string
  vehicleNo: string
  driver: string
  driverPhone: string
  date: string
  time: string
  description: string
  category: string
  amount: number
}

export interface ExpenseFilters {
  vehicleNo: string
  driver: string
  dateFrom: string
  dateTo: string
  description: string
  category: string
  amount: string
}

interface ExpenseState {
  expenses: Expense[]
  filters: ExpenseFilters
}

const initialState: ExpenseState = {
  expenses: [
    {
      id: "1",
      vehicleNo: "MH-12-AB-1234",
      driver: "Rajesh Kumar",
      driverPhone: "+91 98765 43210",
      date: "2024-01-15",
      time: "09:30",
      description: "Fuel - Diesel 50L",
      category: "Fuel",
      amount: 4500,
    },
    {
      id: "2",
      vehicleNo: "MH-12-CD-5678",
      driver: "Amit Sharma",
      driverPhone: "+91 98765 43211",
      date: "2024-01-14",
      time: "14:15",
      description: "Oil Change & Filter",
      category: "Oil Change",
      amount: 2800,
    },
    {
      id: "3",
      vehicleNo: "MH-12-AB-1234",
      driver: "Rajesh Kumar",
      driverPhone: "+91 98765 43210",
      date: "2024-01-13",
      time: "11:00",
      description: "Toll - Mumbai-Pune",
      category: "Toll",
      amount: 350,
    },
    {
      id: "4",
      vehicleNo: "MH-12-EF-9012",
      driver: "Suresh Patil",
      driverPhone: "+91 98765 43212",
      date: "2024-01-12",
      time: "16:45",
      description: "Tire Replacement - Front",
      category: "Maintenance",
      amount: 8500,
    },
    {
      id: "5",
      vehicleNo: "MH-12-CD-5678",
      driver: "Amit Sharma",
      driverPhone: "+91 98765 43211",
      date: "2024-01-11",
      time: "10:20",
      description: "Fuel - Diesel 45L",
      category: "Fuel",
      amount: 4050,
    },
  ],
  filters: {
    vehicleNo: "all",
    driver: "all",
    dateFrom: "",
    dateTo: "",
    description: "",
    category: "all",
    amount: "",
  },
}

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload)
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((exp) => exp.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = action.payload
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((exp) => exp.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<{ key: keyof ExpenseFilters; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { addExpense, updateExpense, deleteExpense, setFilter, clearFilters } = expenseSlice.actions

export default expenseSlice.reducer
