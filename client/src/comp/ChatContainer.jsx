import { PaperPlaneRight, Paperclip } from "@phosphor-icons/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/socketContext";
import {
  useGetChatDetails,
  useGetChatMessages,
} from "../features/chatFeatures/useChatDetails";
import useSocketEvents from "../hooks/useSocketEvents";

import {
  NEW_MESSAGE,
  REFETCH_CHATS,
  START_TYPING,
  STOP_TYPING,
} from "../contants/event";

import ChatHeader from "../comp/ChatHeader";
import FileMenu from "../comp/FileMenu";
import MessageReceiverItem from "../comp/MessageReceiverItem";
import MessageReceiverPhoto from "../comp/MessageReceiverPhoto";
import MessageSenderItem from "../comp/MessageSenderItem";
import MessageSenderPhoto from "../comp/MessageSenderPhoto";
import { setIamTyping, setIsFileMenu } from "../redux/reducer/miscSlice";

import { motion } from "framer-motion";

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const { socket } = useSocket();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentChatId, myChats } = useSelector((state) => state.chat);

  const currentContact = myChats.find(
    (contact) => contact?._id === currentChatId
  );

  const { isFileMenu } = useSelector((state) => state.misc);

  const {
    isLoading,
    error,
    data: chatData,
    refetch,
  } = useGetChatDetails(currentChatId);

  const {
    isLoading: isLoadingMessages,
    error: messageError,
    data: oldMessageData,
    refetch: refetchMessages,
  } = useGetChatMessages(currentChatId, page);

  useEffect(() => {
    refetch();
    setMessages([]);
    setPage(1);
  }, [currentChatId, refetch]);

  useEffect(() => {
    if (bottomRef.current && page === 1) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (oldMessageData?.message) {
      setMessages((prev) => [...oldMessageData.message, ...prev]);
      setLoadingMore(false);
    }
  }, [oldMessageData]);

  const newMessageHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data]);
  }, []);

  const refetchListner = useCallback(() => {
    refetch();
    navigate("/");
  }, [refetch, navigate]);

  const eventHandler = {
    [NEW_MESSAGE]: newMessageHandler,
    [REFETCH_CHATS]: refetchListner,
  };

  useSocketEvents(socket, eventHandler);

  const handleScroll = useCallback(() => {
    if (
      containerRef.current.scrollTop === 0 &&
      !isLoadingMessages &&
      !loadingMore
    ) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoadingMessages, loadingMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      refetchMessages();
    }
  }, [page, refetchMessages]);

  if (isLoading) return <h1>Loading</h1>;

  if (isLoadingMessages && page === 1) return <h1>Message loading</h1>;

  const allMessages = [...messages];

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-2/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col relative"
    >
      <ChatHeader />

      <div
        ref={containerRef}
        className="chat-section w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[url('../src/assets/background.jpeg')] bg-contain flex-grow p-4 gap-5 flex flex-col overflow-auto overflow-x-hidden"
      >
        {isFileMenu && <FileMenu chatId={currentChatId} />}

        {allMessages.map((message, i) =>
          message?.sender?._id !== user?._id ? (
            message?.content === "" ? (
              message?.attachments.map((att, j) => (
                <MessageSenderPhoto att={att} key={j} />
              ))
            ) : (
              <MessageSenderItem key={i}>{message?.content}</MessageSenderItem>
            )
          ) : message?.content === "" ? (
            message?.attachments.map((att, j) => (
              <MessageReceiverPhoto att={att} key={j} />
            ))
          ) : (
            <MessageReceiverItem key={i}>
              {message?.content}
            </MessageReceiverItem>
          )
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput chatId={chatData?._id} members={chatData?.members} />
    </motion.div>
  );
}

function ChatInput({ chatId, members }) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const typingTimeout = useRef(null);

  const { isFileMenu, iamTyping, userTyping } = useSelector(
    (state) => state.misc
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // emiiting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const handleFileOpen = () => {
    dispatch(setIsFileMenu(!isFileMenu));
  };

  const handleChangeInput = (e) => {
    setMessage(e.target.value);

    if (!iamTyping) {
      socket.emit(START_TYPING, { chatId, members });
      dispatch(setIamTyping(true));
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { chatId, members });
      dispatch(setIamTyping(false));
    }, [2000]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
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
        onChange={handleChangeInput}
        onKeyDown={handleKeyDown}
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

export default ChatContainer;
