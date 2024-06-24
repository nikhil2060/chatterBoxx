import { Video, Headphones, Image, File } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useSendAttachments } from "../features/chatFeatures/useSendAttachments";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreateGroup, setIsFileMenu } from "../redux/reducer/miscSlice";
import axios from "axios";
import { logOutRoute } from "../utils/AuthRoutes";
import { userNotExists } from "../redux/reducer/authSlice";

function UserMenu({ chatId }) {
  const menuRef = useRef(null);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const dispatch = useDispatch();
  const { isSending, mutateSend } = useSendAttachments();

  const { isCreateGroup } = useSelector((state) => state.misc);

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
      toast.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuLoaded(true);
    }, 5);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.top = menuLoaded ? "70px" : "0";
    }
  }, [menuLoaded]);

  const handleNewGroup = () => {
    dispatch(setIsCreateGroup(!isCreateGroup));
  };

  return (
    <StyledMenu ref={menuRef}>
      <StyledItem onClick={handleNewGroup}>New group</StyledItem>
      <StyledItem onClick={handleLogout}>Logout</StyledItem>
    </StyledMenu>
  );
}

const StyledMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  height: 80px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #f4f4f5;
  padding: 15px;
  border-radius: 0px 00px 0px 5px;
  box-shadow: 0px 0px 10px #33333330;
  transition: top 0.5s ease;
  z-index: 10;
`;

const StyledItem = styled.div`
  /* background-color: #b4d4f2; */
  font-size: 12px;
  padding: 4px 10px 4px 10px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    transform: scale(1.06);
  }
`;

export default UserMenu;
