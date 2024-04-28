import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/authSlice";
import chatSlice from "./reducer/chatSlice";
import miscSlice from "./reducer/miscSlice";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
  },
});

export default store;
