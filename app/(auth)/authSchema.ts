// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth Interface
export interface LoginInterface {
  email: string;
  password: string;
}

// Auth Response Interface
export interface LoginResponseInterface {
  token: string;
  user: User;
  message: string;
}


// Auth Request Interface
export interface SignupRequestInterface {
  name: string;
  email: string;
  password: string;
}

// Auth Response Interface
export interface SignupResponseInterface {
  token: string;
  user: User;
  message: string;
}

// Auth Response Interface
export interface VerifyTokenResponseInterface {
  user: User;
  message: string;
}
