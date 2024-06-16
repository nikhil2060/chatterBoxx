import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/socketContext";

import useSocketEvents from "../hooks/useSocketEvents";

import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
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

function Chat() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const dispatch = useDispatch();

  const { isSearch, isNotification } = useSelector((state) => state.misc);
  const { isCreateGroup } = useSelector((state) => state.misc);
  const { currentChatId } = useSelector((state) => state.chat);

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
    <div className="w-full h-[100vh] bg-red-200 flex items-center justify-center bg-gradient-to-r from-rose-50 to-teal-50 relative">
      {isSearch && (
        <Modal>
          <SearchWindow />
        </Modal>
      )}

      {isCreateGroup && <CreateGroup chatId={user?._id} />}

      {isNotification && (
        <NotificationModal>
          <Notification />
        </NotificationModal>
      )}
      <div
        className="chat-container w-5/6 h-5/6 bg-[#B3D4F2] rounded-[2rem]
      flex gap-[1.25rem] p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
      >
        <ContactsContainer />
        <ChatContainer />
      </div>
    </div>
  );
}

export default Chat;
