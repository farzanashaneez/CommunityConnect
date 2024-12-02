import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  currentAdmin: any | null; // Consider defining a more specific type for admin
  isLogged: boolean;
}

const initialState: AdminState = {
  currentAdmin: null,
  isLogged: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loggedin: (state, action: PayloadAction<any>) => {
      state.currentAdmin = action.payload;
      state.isLogged = true;
    },
    loginfailure: (state) => {
      state.currentAdmin = null;
      state.isLogged = false;
    },
    loggedOut: (state) => {
      state.currentAdmin = null;
      state.isLogged = false;
    },
  },
});

export const { loggedin, loggedOut, loginfailure } = adminSlice.actions;
export default adminSlice.reducer;