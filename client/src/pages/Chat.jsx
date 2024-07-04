import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/socketContext";
import { motion } from "framer-motion";
import useSocketEvents from "../hooks/useSocketEvents";

import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  START_TYPING,
  STOP_TYPING,
} from "../contants/event";

import toast from "react-hot-toast";
import ChatContainer from "../comp/ChatContainer";
import ContactsContainer from "../comp/ContactsContainer";
import { incrementNotificatinCount } from "../redux/reducer/chatNoteSlice";
import { setUserTyping } from "../redux/reducer/miscSlice";
import Modal from "../ui/Modal";
import NotificationModal from "../ui/ModalNotification";
import Notification from "../ui/Notification";
import SearchWindow from "../ui/SearchWindow";
import CreateGroup from "../comp/CreateGroup";
import AddMember from "../comp/Group/AddMember";

function Chat() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const dispatch = useDispatch();

  const { isSearch, isNotification } = useSelector((state) => state.misc);
  const { isCreateGroup, isAddGroupMember } = useSelector(
    (state) => state.misc
  );

  const newMessageHandler = useCallback(
    (data) => {
      if (user?._id == data?.chatId) return;
      toast("🔔 New message ", {
        duration: 2000,
        position: "top-right",
      });
    },
    [user?._id]
  );

  const newRequestHandler = useCallback(() => {
    dispatch(incrementNotificatinCount());
    toast("🔔 New request ", {
      duration: 2000,
      position: "top-right",
    });
  }, [dispatch]);

  const startTypingHandler = useCallback(
    (data) => {
      if (user?._id != data?.chatId) return;
      console.log("Typing");
      dispatch(setUserTyping(true));
    },
    [user?._id, dispatch]
  );

  const stopTypingHandler = useCallback(
    (data) => {
      if (user?._id != data?.chatId) return;
      dispatch(setUserTyping(false));
    },
    [user?._id, dispatch]
  );

  const eventHandler = {
    [NEW_REQUEST]: newRequestHandler,
    [NEW_MESSAGE_ALERT]: newMessageHandler,
    [START_TYPING]: startTypingHandler,
    [STOP_TYPING]: stopTypingHandler,
  };

  useSocketEvents(socket, eventHandler);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="w-full h-[100vh] bg-red-200 flex items-center justify-center bg-gradient-to-r from-rose-50 to-teal-50 relative flex-col">
      {isSearch && (
        <Modal>
          <SearchWindow />
        </Modal>
      )}

      {isCreateGroup && <CreateGroup chatId={user?._id} />}

      {isAddGroupMember && <AddMember />}

      {isNotification && (
        <NotificationModal>
          <Notification />
        </NotificationModal>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="chat-container w-5/6 h-5/6 bg-[#B3D4F2] rounded-[2rem]
      flex gap-[1.25rem] p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
      >
        <ContactsContainer />
        <ChatContainer />
      </motion.div>

      <footer className=" text-grey-500 py-5 text-center absolute bottom-1">
        <div className="container mx-auto">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ChatterBoxx. Created by Nikhil
            Kumar Singh
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Chat;
