import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myChats: [],
  isLoading: true,
  currentContact: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMyChats: (state, action) => {
      state.myChats = action.payload;
      state.isLoading = false;
    },
  },
});

export default chatSlice;

export const { setMyChats } = chatSlice.actions;
