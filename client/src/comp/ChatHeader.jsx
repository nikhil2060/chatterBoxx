import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatDetails from "./ChatDetails";
import GroupDetails from "./GroupDetails";

function ChatHeader() {
  const { currentChatId, myChats } = useSelector((state) => state.chat);

  const disable = currentChatId !== "" ? true : false;

  const currentContact = myChats.find(
    (contact) => contact?._id === currentChatId
  );

  const isGroupChat = currentContact?.groupChat;

  const [isDetail, setIsDetail] = useState(false);

  const avatarUrl = currentContact?.groupChat
    ? "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png"
    : currentContact?.avatar;

  useEffect(() => {
    setIsDetail(false);
  }, [currentChatId]);

  const handleOpen = () => {
    if (!disable) return;
    setIsDetail(!isDetail);
  };

  return (
    <div className="chat-header w-full min-h-[4.5rem] rounded-t-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-[200] flex items-center pr-6 justify-between">
      <div className="flex items-center pl-6 pr-6 gap-5">
        <div
          className="w-12 h-12 bg-zinc-600 rounded-full overflow-hidden bg-contain border-[#00223f] border-[1.5px]"
          onClick={handleOpen}
        >
          <img
            src={
              !currentChatId
                ? `https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png`
                : avatarUrl
            }
            alt="profilePic1"
          />
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          {!currentChatId ? `Please select a chat` : currentContact?.name}
        </div>
      </div>

      {isDetail &&
        (isGroupChat ? (
          <GroupDetails currentChatId={currentChatId} />
        ) : (
          <ChatDetails currentChatId={currentChatId} />
        ))}
    </div>
  );
}

export default ChatHeader;
