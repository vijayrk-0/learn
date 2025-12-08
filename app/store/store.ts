// store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

export const store = configureStore({
    // Create a store
    reducer: {
        // Create an authReducer
        auth: authReducer,
    },
})

// Create an RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
