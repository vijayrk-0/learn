import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import { dashboardApi, dashboardApiList } from './rtk/dashboardRTK';
import { forgetPasswordApi } from './rtk/forgetPasswordRTK';
import { authApi } from './rtk/authRTK';
export const store = configureStore({
    // Create a store
    reducer: {
        // Create an authReducer
        auth: authReducer,

        // Create a dashboardApi reducer
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        // Create a dashboardApiList reducer
        [dashboardApiList.reducerPath]: dashboardApiList.reducer,
        // Create a authApi reducer
        [authApi.reducerPath]: authApi.reducer,
        // Create a forgetPasswordApi reducer
        [forgetPasswordApi.reducerPath]: forgetPasswordApi.reducer,
    },
    // Create a middleware
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            dashboardApi.middleware,
            dashboardApiList.middleware,
            authApi.middleware,
            forgetPasswordApi.middleware
        ),
})

// Create an RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
