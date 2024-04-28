import { PaperPlaneRight, Paperclip } from "@phosphor-icons/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactsContainer from "../comp/ContactsContainer";
import { useContacts } from "../contexts/UsersContext";
import { userNotExists } from "../redux/reducer/authSlice";
import { logOutRoute } from "../utils/AuthRoutes";

function Chat() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const { isSearch } = useSelector((state) => state.misc);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="w-full h-[100vh] bg-red-200 flex items-center justify-center bg-gradient-to-r from-rose-50 to-teal-50">
      {isSearch && <div>Search Container</div>}
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
  return (
    <div className="w-2/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col">
      <ChatHeader />

      <div className="chat-section w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[url('../src/assets/background.jpeg')] bg-contain flex-grow"></div>

      <ChatInput />
    </div>
  );
}

function ChatHeader() {
  const { currentContact } = useContacts();
  const dispatch = useDispatch();

  const imagePath = "../../uploads/170917084085530743.jpg";

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
          <img
            src={"URL=../../../uploads/170917084085530743.jpg"}
            alt="profilePic1"
          />
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          {currentContact.username}
          hello
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

function ChatInput() {
  const [message, setMessage] = useState("");

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

      <button className="rounded-full bg-[#B4D4F2] p-2 flex items-center justify-center shadow-lg">
        <PaperPlaneRight size={26} color="#666" />
      </button>
    </div>
  );
}
