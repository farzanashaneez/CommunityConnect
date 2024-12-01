import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  admin: any | null; // Consider defining a more specific type for admin
  isLogged: boolean;
}

const initialState: AdminState = {
  admin: null,
  isLogged: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loggedin: (state, action: PayloadAction<any>) => {
      state.admin = action.payload;
      state.isLogged = true;
    },
    loginfailure: (state) => {
      state.admin = null;
      state.isLogged = false;
    },
    loggedOut: (state) => {
      state.admin = null;
      state.isLogged = false;
    },
  },
});

export const { loggedin, loggedOut, loginfailure } = adminSlice.actions;
export default adminSlice.reducer;