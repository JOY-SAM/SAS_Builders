import { configureStore } from "@reduxjs/toolkit"
import expenseReducer from "./slices/expenseSlice"
import oilChangeReducer from "./slices/oilChangeSlice"

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    oilChange: oilChangeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
