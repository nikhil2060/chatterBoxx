import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isLoggedIn = false;
    },
  },
});

export default authSlice;

export const { userExists, userNotExists } = authSlice.actions;
