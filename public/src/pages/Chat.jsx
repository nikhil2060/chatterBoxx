import { PaperPlaneRight, Paperclip } from "@phosphor-icons/react";
import React, { useState } from "react";
import ContactsContainer from "../comp/ContactsContainer";
import { useContacts } from "../contexts/UsersContext";

// import image from "../../../server/uploads/170917084085530743.jpg";

function Chat() {
  return (
    <div className="page w-full h-[100vh] bg-red-200 flex items-center justify-center bg-gradient-to-r from-rose-50 to-teal-50">
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

  const imagePath = "../../uploads/170917084085530743.jpg";

  return (
    <div className="chat-header w-full min-h-[4.5rem] rounded-t-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 flex items-center pl-6 pr-6 gap-5">
      <div className="w-12 h-12 bg-zinc-600 rounded-full overflow-hidden bg-contain border-[#00223f] border-[1.5px]">
        <img
          src={"URL=../../../uploads/170917084085530743.jpg"}
          alt="profilePic1"
        />
      </div>
      <div className="flex items-center gap-3 text-zinc-500">
        {currentContact.username}
      </div>
    </div>
  );
}

export default Chat;

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
