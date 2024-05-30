import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logOutRoute } from "../utils/AuthRoutes";
import toast from "react-hot-toast";
import { userNotExists } from "../redux/reducer/authSlice";
import GroupDetails from "./GroupDetails";
import { useEffect, useState } from "react";
import ChatDetails from "./ChatDetails";

function ChatHeader() {
  const { currentChatId, myChats } = useSelector((state) => state.chat);

  const currentContact = myChats.find(
    (contact) => contact?._id === currentChatId
  );

  const isGroupChat = currentContact?.groupChat;

  const [isDetail, setIsDetails] = useState(false);

  useEffect(() => {
    setIsDetails(false);
  }, [currentChatId]);

  return (
    <div className="chat-header w-full min-h-[4.5rem] rounded-t-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 flex items-center pr-6 justify-between">
      <div className="flex items-center pl-6 pr-6 gap-5">
        <div
          className="w-12 h-12 bg-zinc-600 rounded-full overflow-hidden bg-contain border-[#00223f] border-[1.5px]"
          onClick={() => setIsDetails(!isDetail)}
        >
          <img src={currentContact?.avatar} alt="profilePic1" />
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          {currentContact?.name}
        </div>
      </div>

      {isDetail ? (
        isGroupChat ? (
          <GroupDetails currentChatId={currentChatId} />
        ) : (
          <ChatDetails currentChatId={currentChatId} />
        )
      ) : null}
      {/* <GroupDetails /> */}
    </div>
  );
}

export default ChatHeader;
