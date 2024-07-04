import { Image } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useSendAttachments } from "../features/chatFeatures/useSendAttachments";
import { setIsFileMenu } from "../redux/reducer/miscSlice";

function FileMenu({ chatId }) {
  const menuRef = useRef(null);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const dispatch = useDispatch();
  const { mutateSend } = useSendAttachments();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuLoaded(true);
    }, 5);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.bottom = menuLoaded ? "70px" : "0";
    }
  }, [menuLoaded]);

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) {
      return;
    }

    if (files.length > 5) toast.error("Select files less than 5");

    const formData = new FormData();

    formData.append("chatId", chatId);

    files.forEach((file) => formData.append("files", file));

    try {
      await mutateSend({ formData, key });
      toast("Sending...");
    } catch (error) {
      toast.error(error);
    } finally {
      setMenuLoaded(false);
      dispatch(setIsFileMenu(false));
    }
  };

  return (
    <StyledMenu ref={menuRef}>
      <StyledItem>
        <Image size={15} />
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg, image/gif"
          hidden
          multiple
          onChange={(e) => fileChangeHandler(e, "Images")}
        />
      </StyledItem>
    </StyledMenu>
  );
}

const StyledMenu = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #f4f4f5;
  padding: 15px;
  border-radius: 0px 20px 0px 0px;
  box-shadow: 0px 0px 10px #33333330;
  transition: bottom 0.5s ease;
  z-index: 10;
`;

const StyledItem = styled.div`
  background-color: #b4d4f2;
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

export default FileMenu;
