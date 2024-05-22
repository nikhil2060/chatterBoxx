import { Bell, UserCirclePlus, UsersThree } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyChats } from "../features/chatFeatures/useGetMyChats";
import { setCurrentChat, setMyChats } from "../redux/reducer/chatSlice";
import { setIsNotification, setIsSearch } from "../redux/reducer/miscSlice";
import { resetNotificatinCount } from "../redux/reducer/chatNoteSlice";

function ContactsContainer() {
  const dispatch = useDispatch();

  const [openMyProfile, setOpenMyProfile] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { isSearch, isNotification } = useSelector((state) => state.misc);

  const { notificationCount } = useSelector((state) => state.chatNoti);

  if (!user) return <h1>LOADING</h1>;

  const handleSearchClick = () => {
    dispatch(setIsSearch(!isSearch));
  };

  const handleNotificationClick = () => {
    dispatch(setIsNotification(!isNotification));
    dispatch(resetNotificatinCount());
  };

  return (
    <div className="w-1/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col">
      <div className="chat-header w-full min-h-[4.5rem] rounded-t-xl bg-zinc-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 flex items-center pl-6 pr-6 justify-between">
        <div
          className="w-12 h-12 bg-red-200 rounded-full overflow-hidden bg-contain border-[#00223f] border-[1.5px]"
          onClick={() => setOpenMyProfile(!openMyProfile)}
        >
          <img src={user.avatar.url} alt="profilePic" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell
              size={24}
              color="#00223f"
              className="mouse-cursor"
              onClick={notificationCount ? handleNotificationClick : null}
            />
            <span className="absolute top-0 right-0 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center w-3 h-3">
              {notificationCount}
            </span>
          </div>

          <UserCirclePlus
            size={24}
            color="#00223f"
            onClick={handleSearchClick}
          />
          <UsersThree size={24} color="#00223f" />
        </div>
      </div>

      {openMyProfile ? <MyProfile /> : <ContactsSection />}
    </div>
  );
}

function MyProfile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-section flex flex-col p-20 gap-10 items-center w-full bg-zinc-100 flex-grow overflow-auto rounded-b-xl">
      <div className="w-[10rem] h-[10rem] bg-red-300 rounded-full ">
        <img src={user.avatar.url} alt="profilePic" />
      </div>
      <div className="flex flex-col gap-5 items-center">
        <span>Username : {user.username}</span>
        <span>Name : {user.name}</span>
        <span>ABOUt</span>
      </div>
    </div>
  );
}

function ContactsSection() {
  const dispatch = useDispatch();

  const { currentChatId } = useSelector((state) => state.chat);

  const { isLoading, error, myChats } = useGetMyChats();

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMyChats(myChats));
    }
  }, [isLoading, myChats, dispatch]);

  return isLoading ? (
    <div className="chat-section w-full bg-zinc-100 flex-grow overflow-auto rounded-b-xl">
      <CircularProgress />
    </div>
  ) : (
    <div className="chat-section w-full bg-zinc-100 flex-grow overflow-auto rounded-b-xl">
      {myChats.map((contact, index) => {
        return (
          <ContactBox
            key={index}
            contact={contact}
            isSelected={currentChatId === contact._id}
          />
        );
      })}
    </div>
  );
}

function ContactBox({ contact, isSelected }) {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => dispatch(setCurrentChat(contact._id))}
      className={`w-full h-[4.5rem] flex items-center p-5 gap-5 border-b-[1px] border-zinc-400 transition duration-400 ${
        isSelected ? "bg-[#B3D4F2] shadow-md z-50 border-none " : ""
      }`}
    >
      <div className="image-box w-10 h-10 bg-zinc-600 rounded-full overflow-hidden bg-cover ">
        <img src={contact.avatar[0]} alt="profilePic" />
      </div>
      <span>{contact.name}</span>
    </div>
  );
}

export default ContactsContainer;
