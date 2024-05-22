import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/authSlice";
import chatSlice from "./reducer/chatSlice";
import miscSlice from "./reducer/miscSlice";
import chatNotiSlice from "./reducer/chatNoteSlice";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatNotiSlice.name]: chatNotiSlice.reducer,
  },
});

export default store;
