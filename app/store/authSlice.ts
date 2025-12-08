import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Create a User Interface  
interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

// Create an AuthState Interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}


// Create an initialState
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};


// Create an authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Create an initAuth function
    initAuth(state) {
      if (typeof window === 'undefined') return;

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }

      state.isLoading = false;
    },
    // Create a login function
    login(
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) {
      console.log(action.payload);
      const { token, user } = action.payload;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
    },
    // Create a logout function
    logout(state) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Create an authActions
export const { initAuth, login, logout } = authSlice.actions;

// Create an authReducer
export default authSlice.reducer;
