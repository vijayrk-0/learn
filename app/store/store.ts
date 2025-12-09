// store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { dashboardApi } from './dashboard'
export const store = configureStore({
    // Create a store
    reducer: {
        // Create an authReducer
        auth: authReducer,
        // Create a dashboardApi reducer
        [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(dashboardApi.middleware),
})

// Create an RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
