import {
  Bell,
  DotsThreeOutlineVertical,
  UserCirclePlus,
  Users,
  UsersFour,
} from "@phosphor-icons/react";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { resetNotificatinCount } from "../redux/reducer/chatNoteSlice";
import { setIsNotification, setIsSearch } from "../redux/reducer/miscSlice";
import ChatsList from "./ChatsList";
import GroupsList from "./GroupsList";
import UserMenu from "./userActionMenu";

function ContactsContainer() {
  const dispatch = useDispatch();

  const [openMyProfile, setOpenMyProfile] = useState(false);
  const [openGroupSection, setOpenGroupSection] = useState(false);
  const [userMenuLoaded, setUserMenuLoaded] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const { isSearch, isNotification } = useSelector((state) => state.misc);

  // const { notificationCount } = useSelector((state) => state.chatNoti);

  if (!user) return <h1>LOADING</h1>;

  const handleSearchClick = () => {
    dispatch(setIsSearch(!isSearch));
  };

  const handleNotificationClick = () => {
    dispatch(setIsNotification(!isNotification));
    dispatch(resetNotificatinCount());
  };

  const handleOpenGroupList = () => {
    setOpenGroupSection(!openGroupSection);
  };

  const handleUserMenuLoaded = () => {
    setUserMenuLoaded(!userMenuLoaded);
  };

  return (
    <div className="w-1/3 h-full bg-zinc-200 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col relative">
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
              onClick={handleNotificationClick}
            />
          </div>

          <UserCirclePlus
            size={24}
            color="#00223f"
            onClick={handleSearchClick}
          />

          {openGroupSection ? (
            <Users size={24} color="#00223f" onClick={handleOpenGroupList} />
          ) : (
            <UsersFour
              size={24}
              color="#00223f"
              onClick={handleOpenGroupList}
            />
          )}

          <DotsThreeOutlineVertical
            size={24}
            color="#00223f"
            onClick={handleUserMenuLoaded}
          />
        </div>
      </div>

      {openMyProfile ? (
        <MyProfile />
      ) : openGroupSection ? (
        <GroupsList />
      ) : (
        <ChatsList />
      )}

      {userMenuLoaded && <UserMenu />}
    </div>
  );
}

function MyProfile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <ProfileSection>
      <AvatarContainer>
        <Avatar src={user.avatar.url} alt="profilePic" />
      </AvatarContainer>
      <UserInfo>
        <UserDetail>
          <strong>Username:</strong> {user.username}
        </UserDetail>
        <UserDetail>
          <strong>Name:</strong> {user.name}
        </UserDetail>
        <UserDetail>
          <strong>Email:</strong> {user.email}
        </UserDetail>
        <UserDetail>
          <strong>Bio:</strong> {user.bio || "No bio available"}
        </UserDetail>
      </UserInfo>
    </ProfileSection>
  );
}

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  width: 100%;
  background-color: #f4f4f4;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AvatarContainer = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  color: #333;
`;

const UserDetail = styled.span`
  font-size: 1rem;
  color: #666;

  strong {
    color: #333;
  }
`;

export default ContactsContainer;
