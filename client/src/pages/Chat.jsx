import { PaperPlaneRight, Paperclip } from "@phosphor-icons/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactsContainer from "../comp/ContactsContainer";
import { useContacts } from "../contexts/UsersContext";
import { userNotExists } from "../redux/reducer/authSlice";
import { logOutRoute } from "../utils/AuthRoutes";
import Modal from "../ui/Modal";
import SearchWindow from "../ui/SearchWindow";
import NotificationModal from "../ui/ModalNotification";
import Notification from "../ui/Notification";
import { useSocket } from "../contexts/socketContext";
import { NEW_MESSAGE } from "../contants/event";

import { useGetChatDetails } from "../features/chatFeatures/useChatDetails";
import useSocketEvents from "../hooks/useSocketEvents";

function Chat() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

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
  const { currentChatId } = useSelector((state) => state.chat);

  const { isLoading, error, data, refetch } = useGetChatDetails(currentChatId);

  const { socket } = useSocket();

  const newMessageHandler = useCallback((data) => {
    console.log(data);
  }, []);

  const eventHandler = { [NEW_MESSAGE]: newMessageHandler };

  useSocketEvents(socket, eventHandler);

  if (isLoading) return <h1>Loading</h1>;

  return (
    <div className="w-2/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col">
      <ChatHeader />

      <div className="chat-section w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[url('../src/assets/background.jpeg')] bg-contain flex-grow p-4">
        hello
      </div>

      <ChatInput chatId={data?._id} members={data?.members} />
    </div>
  );
}

function ChatHeader() {
  const { currentChatId, myChats } = useSelector((state) => state.chat);

  const currentContact = myChats.find(
    (contact) => contact._id === currentChatId
  );

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios
        .get(logOutRoute, {
          withCredentials: true,
        })
        .then(({ data }) => {
          if (data.status) {
            toast.success("logged out successfully");
            dispatch(userNotExists());
          }
        })
        .catch((err) => console.error("Something went wrong"));
    } catch (error) {
      // asd
    }
  };

  return (
    <div className="chat-header w-full min-h-[4.5rem] rounded-t-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 flex items-center pr-6 justify-between">
      <div className="flex items-center pl-6 pr-6 gap-5">
        <div className="w-12 h-12 bg-zinc-600 rounded-full overflow-hidden bg-contain border-[#00223f] border-[1.5px]">
          <img src={currentContact?.avatar} alt="profilePic1" />
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          {currentContact?.name}
        </div>
      </div>
      <div>
        <button
          className=" rounded-full bg-red-400 px-2 py-1 text-sm text-zinc-100 shadow-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function ChatInput({ chatId, members }) {
  const [message, setMessage] = useState("");

  const { socket } = useSocket();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // emiiting message to the server

    socket.emit(NEW_MESSAGE, { chatId, members, message });

    setMessage("");
  };

  return (
    <div className="chat-header w-full min-h-[4.5rem] rounded-b-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 flex items-center pl-6 pr-6 gap-5 justify-between">
      <button className="rounded-full bg-[#B4D4F2] p-2 flex items-center justify-center shadow-lg">
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
