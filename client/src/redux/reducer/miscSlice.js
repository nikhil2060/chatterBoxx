import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobileMenuFriend: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  iamTyping: false,
  isCreateGroup: false,
  isAddGroupMember: false,
  userTyping: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
  selectedChat: "",
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobileMenuFriend: (state, action) => {
      state.isMobileMenuFriend = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsCreateGroup: (state, action) => {
      state.isCreateGroup = action.payload;
    },
    setIsAddGroupMember: (state, action) => {
      state.isAddGroupMember = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setisDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setselectedDeleteChat: (state, action) => {
      state.selectedDeleteChat.chatId = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setIamTyping: (state, action) => {
      state.iamTyping = action.payload;
    },
    setUserTyping: (state, action) => {
      state.userTyping = action.payload;
    },
  },
});

export default miscSlice;

export const {
  setIsNewGroup,
  setIsAddMember,
  setIsSearch,
  setIsNotification,
  setIsFileMenu,
  setIamTyping,
  setUserTyping,
  setIsCreateGroup,
  setIsAddGroupMember,
} = miscSlice.actions;
