import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myChats: [],
  isLoading: true,
  currentChatId: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMyChats: (state, action) => {
      state.myChats = action.payload;
      state.isLoading = false;
    },
    setCurrentChat: (state, action) => {
      state.currentChatId = action.payload;
    },
  },
});

export default chatSlice;

export const { setMyChats, setCurrentChat } = chatSlice.actions;
