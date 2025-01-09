import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

// Define a type for the user
interface User {
  name: string;
  email: string;
  picture: string;
  // Add any other properties that a user might have
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;  // user can be null if not logged in
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      redirect('/')
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
