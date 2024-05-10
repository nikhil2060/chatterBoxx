import { PaperPlaneRight, Paperclip } from "@phosphor-icons/react";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSocket } from "../contexts/socketContext";
import { userNotExists } from "../redux/reducer/authSlice";

import {
  useGetChatDetails,
  useGetChatMessages,
} from "../features/chatFeatures/useChatDetails";
import useSocketEvents from "../hooks/useSocketEvents";

import { NEW_MESSAGE } from "../contants/event";
import { logOutRoute } from "../utils/AuthRoutes";

import ContactsContainer from "../comp/ContactsContainer";
import MessageReceiverItem from "../comp/MessageReceiverItem";
import MessageSenderItem from "../comp/MessageSenderItem";
import { setIsFileMenu } from "../redux/reducer/miscSlice";
import Modal from "../ui/Modal";
import NotificationModal from "../ui/ModalNotification";
import Notification from "../ui/Notification";
import SearchWindow from "../ui/SearchWindow";
import ChatHeader from "../comp/ChatHeader";
import FileMenu from "../comp/FileMenu";

function Chat() {
  const { user } = useSelector((state) => state.auth);

  const { isSearch, isNotification } = useSelector((state) => state.misc);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="w-full h-[100vh] bg-red-200 flex items-center justify-center bg-gradient-to-r from-rose-50 to-teal-50">
      {isSearch && (
        <Modal>
          <SearchWindow />
        </Modal>
      )}
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

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const containerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { currentChatId } = useSelector((state) => state.chat);
  const { isFileMenu } = useSelector((state) => state.misc);

  const {
    isLoading,
    error,
    data: chatData,
    refetch,
  } = useGetChatDetails(currentChatId);

  const {
    isLoading: isLoadingMessages,
    error: messsageError,
    data: oldMessageData,
    refetch: refetchMesseages,
  } = useGetChatMessages(currentChatId, page);

  useEffect(() => {
    refetch();
    refetchMesseages();
  }, [refetch, currentChatId, refetchMesseages]);

  // const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
  //   containerRef,
  //   oldMessageData?.totalPages,
  //   page,
  //   setPage,
  //   oldMessageData?.message
  // );

  const { socket } = useSocket();

  const newMessageHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data]);
  }, []);

  const eventHandler = { [NEW_MESSAGE]: newMessageHandler };

  useSocketEvents(socket, eventHandler);

  if (isLoading) return <h1>Loading</h1>;

  if (isLoadingMessages) return <h1>Message loading</h1>;

  // const allMessages = [...oldMessages, ...messages];

  return (
    <div className="w-2/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col relative">
      <ChatHeader />

      <div className="chat-section w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[url('../src/assets/background.jpeg')] bg-contain flex-grow p-4 gap-5 flex flex-col overflow-auto overflow-x-hidden">
        {isFileMenu && <FileMenu />}

        {oldMessageData !== undefined &&
          oldMessageData?.message.map((message, i) =>
            message?.sender?._id != user?._id ? (
              <MessageSenderItem key={i}>{message?.content}</MessageSenderItem>
            ) : (
              <MessageReceiverItem key={i}>
                {message?.content}
              </MessageReceiverItem>
            )
          )}

        {messages.map((message, i) =>
          message?.message?.sender?._id != user?._id ? (
            <MessageSenderItem key={i}>
              {message?.message?.content}
            </MessageSenderItem>
          ) : (
            <MessageReceiverItem key={i}>
              {message?.message?.content}
            </MessageReceiverItem>
          )
        )}
      </div>

      <ChatInput chatId={chatData?._id} members={chatData?.members} />
    </div>
  );
}

function ChatInput({ chatId, members }) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // emiiting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const handleFileOpen = () => {
    dispatch(setIsFileMenu(true));
  };

  return (
    <div className="chat-header w-full min-h-[4.5rem] rounded-b-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 flex items-center pl-6 pr-6 gap-5 justify-between">
      <button
        className="rounded-full bg-[#B4D4F2] p-2 flex items-center justify-center shadow-lg"
        onClick={handleFileOpen}
      >
        <Paperclip size={24} />
      </button>

      <input
        type="text"
        value={message}
        placeholder="type something..."
        className="w-full h-1/2 rounded-full p-5 text-sm"
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        className="rounded-full bg-[#B4D4F2] p-2 flex items-center justify-center shadow-lg"
        onClick={handleSendMessage}
      >
        <PaperPlaneRight size={26} color="#666" />
      </button>
    </div>
  );
}
