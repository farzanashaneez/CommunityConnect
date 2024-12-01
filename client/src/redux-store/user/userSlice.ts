import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: any | null; // Consider defining a more specific type for currentUser
  loading: boolean;
  error: string | boolean;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => { state.loading = true },
    signinSuccess: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signinFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => { state.loading = true },
    updateSuccess: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteStart: (state) => { state.loading = true },
    deleteSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    deleteFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutStart: (state) => { state.loading = true },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    signoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart, signinSuccess, signinFailure,
  updateStart, updateSuccess, updateFailure,
  deleteStart, deleteSuccess, deleteFailure,
  signoutStart, signoutSuccess, signoutFailure
} = userSlice.actions;

export default userSlice.reducer;