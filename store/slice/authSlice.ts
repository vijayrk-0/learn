import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, User } from '@/app/(auth)/authSchema';
import { loadAuthFromStorage, saveAuthToStorage, clearAuthStorage } from '../../app/(auth)/authUtil';


// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Auth initial state
    initAuth(state) {
      const { token, user } = loadAuthFromStorage();
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },
    // Auth set state
    setAuth(
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      saveAuthToStorage(action.payload.token, action.payload.user);
    },
    // Auth logout TO clear state
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      clearAuthStorage();
    },
    // Auth loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuth, logout, setLoading, initAuth } = authSlice.actions;
export default authSlice.reducer;

