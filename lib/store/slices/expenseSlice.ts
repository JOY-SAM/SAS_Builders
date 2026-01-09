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
  expenses: [],
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
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload
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

export const { addExpense, setExpenses, updateExpense, deleteExpense, setFilter, clearFilters } = expenseSlice.actions

export default expenseSlice.reducer
