import React, { useEffect } from "react";

import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyChats } from "../features/chatFeatures/useGetMyChats";
import { setCurrentChat, setMyChats } from "../redux/reducer/chatSlice";
import { motion } from "framer-motion";

function ChatsList() {
  const dispatch = useDispatch();

  const { currentChatId } = useSelector((state) => state.chat);

  const { isLoading, error, myChats } = useGetMyChats();

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMyChats(myChats));
    }
  }, [isLoading, myChats, dispatch]);

  return isLoading ? (
    <div className="chat-section w-full bg-zinc-100 flex-grow overflow-auto rounded-b-xl">
      <CircularProgress />
    </div>
  ) : (
    <div className="chat-section w-full bg-zinc-100 flex-grow overflow-auto rounded-b-xl">
      {myChats.map((contact, index) => {
        return (
          <ChatListItem
            key={index}
            contact={contact}
            isSelected={currentChatId === contact._id}
          />
        );
      })}
    </div>
  );
}

function ChatListItem({ contact, isSelected }) {
  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div
        onClick={() => dispatch(setCurrentChat(contact._id))}
        className={`w-full h-[4.5rem] flex items-center p-5 gap-5 border-b-[1px] border-zinc-400 transition duration-400 ${
          isSelected ? "bg-[#B3D4F2] shadow-md z-50 border-none " : ""
        }`}
      >
        <div className="image-box w-10 h-10 bg-zinc-600 rounded-full overflow-hidden bg-cover ">
          <img src={contact.avatar[0]} alt="profilePic" />
        </div>
        <span>{contact.name}</span>
      </div>
    </motion.div>
  );
}

export default ChatsList;
