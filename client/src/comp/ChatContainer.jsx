import { PaperPlaneRight, Paperclip } from "@phosphor-icons/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../contexts/socketContext";
import { useNavigate } from "react-router-dom";
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
import ChatDetails from "./ChatDetails";
import GroupDetails from "./GroupDetails";

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentChatId, myChats } = useSelector((state) => state.chat);

  const currentContact = myChats.find(
    (contact) => contact?._id === currentChatId
  );

  const { isFileMenu, userTyping } = useSelector((state) => state.misc);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  useEffect(() => {
    setMessages([]);
    setPage(1);
  }, [currentChatId]);

  // useEffect(() => {
  //   if (!chatData) return navigate("/");
  // }, [chatData, navigate]);

  // const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
  //   containerRef,
  //   oldMessageData?.totalPages,
  //   page,
  //   setPage,
  //   oldMessageData?.message
  // );

  const { socket } = useSocket();

  const newMessageHandler = useCallback((data) => {
    // if (currentChatId?._id != data?.chatId) return;
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

  if (isLoading) return <h1>Loading</h1>;

  if (isLoadingMessages) return <h1>Message loading</h1>;

  // const allMessages = [...oldMessages, ...messages];
  // console.log(oldMessageData);

  return (
    <div className="w-2/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col relative">
      <ChatHeader />

      <div className="chat-section w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[url('../src/assets/background.jpeg')] bg-contain flex-grow p-4 gap-5 flex flex-col overflow-auto overflow-x-hidden">
        {isFileMenu && <FileMenu chatId={currentChatId} />}

        {oldMessageData !== undefined &&
          oldMessageData?.message.map((message, i) =>
            message?.sender?._id != user?._id ? (
              message?.content == "" ? (
                message?.attachments.map((att, i) => (
                  <MessageSenderPhoto att={att} key={i} />
                ))
              ) : (
                <MessageSenderItem key={i}>
                  {message?.content}
                </MessageSenderItem>
              )
            ) : message?.content == "" ? (
              message?.attachments.map((att, i) => (
                <MessageReceiverPhoto att={att} key={i} />
              ))
            ) : (
              <MessageReceiverItem key={i}>
                {message?.content}
              </MessageReceiverItem>
            )
          )}

        {messages.map((message, i) =>
          message?.message?.sender?._id != user?._id ? (
            message?.message?.content === "" ? (
              message?.message?.attachments.map((att, i) => (
                <MessageSenderPhoto att={att} key={i} />
              ))
            ) : (
              <MessageSenderItem key={i}>
                {message?.message?.content}
              </MessageSenderItem>
            )
          ) : message?.message?.content === "" ? (
            message?.message?.attachments.map((att, i) => (
              <MessageReceiverPhoto att={att} key={i} />
            ))
          ) : (
            <MessageReceiverItem key={i}>
              {message?.message?.content}
            </MessageReceiverItem>
          )
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput chatId={chatData?._id} members={chatData?.members} />
    </div>
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
