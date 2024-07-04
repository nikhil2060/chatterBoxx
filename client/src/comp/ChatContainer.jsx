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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentChatId } = useSelector((state) => state.chat);

  const { isFileMenu } = useSelector((state) => state.misc);

  const {
    isLoading,
    data: chatData,
    refetch,
  } = useGetChatDetails(currentChatId);

  const {
    isLoading: isLoadingMessages,
    data: oldMessageData,
    refetch: refetchMesseges,
  } = useGetChatMessages(currentChatId, page);

  useEffect(() => {
    refetch();
    refetchMesseges();
  }, [currentChatId, refetch, refetchMesseges]);

  useEffect(() => {
    setMessages([]);
    setPage(1);
  }, [currentChatId]);

  const totalPages = oldMessageData?.totalPages;

  const { socket } = useSocket();

  const newMessageHandler = useCallback(
    (data) => {
      if (currentChatId !== data.chatId) return;
      setMessages((prev) => [...prev, data]);
    },
    [currentChatId]
  );

  const refetchListner = useCallback(() => {
    refetch();
    refetchMesseges();
    navigate("/");
  }, [refetch, refetchMesseges, navigate]);

  const eventHandler = {
    [NEW_MESSAGE]: newMessageHandler,
    [REFETCH_CHATS]: refetchListner,
  };

  useSocketEvents(socket, eventHandler);

  const handleScroll = () => {
    if (
      containerRef.current.scrollTop === 0 &&
      !isLoadingMessages &&
      !loadingMore
    ) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

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
    if (page > 1 && page <= totalPages) {
      refetchMesseges();
    }
  }, [page, refetchMesseges, totalPages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, oldMessageData]);

  if (isLoading) return <h1>Loading</h1>;

  if (isLoadingMessages) return <h1>Message loading</h1>;

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

        {oldMessageData !== undefined &&
          oldMessageData?.message.map((message, i) =>
            message?.sender?._id != user?._id ? (
              message?.content == "" ? (
                message?.attachments.map((att, i) => (
                  <MessageSenderPhoto att={att} key={i} />
                ))
              ) : (
                <MessageSenderItem key={i} message={message} />
              )
            ) : message?.content == "" ? (
              message?.attachments.map((att, i) => (
                <MessageReceiverPhoto att={att} key={i} />
              ))
            ) : (
              <MessageReceiverItem key={i} message={message} />
            )
          )}

        {messages.map((message, i) =>
          message?.message?.sender?._id != user?._id ? (
            message?.message?.content === "" ? (
              message?.message?.attachments.map((att, i) => (
                <MessageSenderPhoto att={att} key={i} />
              ))
            ) : (
              <MessageSenderItem key={i} message={message?.message} />
            )
          ) : message?.message?.content === "" ? (
            message?.message?.attachments.map((att, i) => (
              <MessageReceiverPhoto att={att} key={i} />
            ))
          ) : (
            <MessageReceiverItem key={i} message={message?.message} />
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

  const { currentChatId } = useSelector((state) => state.chat);

  const { isFileMenu, iamTyping } = useSelector((state) => state.misc);

  const disable = currentChatId !== "" ? true : false;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const handleFileOpen = () => {
    if (!disable) return;
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
      dispatch(setIamTyping(true));
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
