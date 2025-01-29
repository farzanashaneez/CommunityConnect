import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SecurityState {
  currentSecurity: any | null; // Consider defining a more specific type for Security
  isLogged: boolean;
}

const initialState: SecurityState = {
  currentSecurity: null,
  isLogged: false,
};

const SecuritySlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    loggedin: (state, action: PayloadAction<any>) => {
      state.currentSecurity = action.payload;
      state.isLogged = true;
    },
    loginfailure: (state) => {
      state.currentSecurity = null;
      state.isLogged = false;
    },
    loggedOut: (state) => {
      state.currentSecurity = null;
      state.isLogged = false;
    },
  },
});

export const { loggedin, loggedOut, loginfailure } = SecuritySlice.actions;
export default SecuritySlice.reducer;