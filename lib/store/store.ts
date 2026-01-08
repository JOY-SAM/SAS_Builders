import { configureStore } from "@reduxjs/toolkit"
import expenseReducer from "./slices/expenseSlice"
import oilChangeReducer from "./slices/oilChangeSlice"
import driverReducer from "./slices/driverSlice"

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    oilChange: oilChangeReducer,
    drivers: driverReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
