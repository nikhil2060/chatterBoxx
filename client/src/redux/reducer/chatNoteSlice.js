import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
};

const chatNotiSlice = createSlice({
  name: "chatNoti",
  initialState,
  reducers: {
    incrementNotificatinCount: (state) => {
      state.notificationCount += 1;
    },
    resetNotificatinCount: (state) => {
      state.notificationCount = 0;
    },
  },
});

export default chatNotiSlice;

export const { incrementNotificatinCount, resetNotificatinCount } =
  chatNotiSlice.actions;
