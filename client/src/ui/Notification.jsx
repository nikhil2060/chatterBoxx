import { Check, X } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  useAcceptRequest,
  useGetNotifications,
} from "../features/UserFeatures/useNotifications";
import { setIsNotification } from "../redux/reducer/miscSlice";

function Notification() {
  const { isLoading, data, error } = useGetNotifications();

  if (isLoading) return <h1>LOADING...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  const notifications = data?.allRequests;

  return (
    <SearchWindowContainer>
      <div className="flex flex-col items-center gap-5">
        <h2>Notifications</h2>
        <SearchResultContainer className="SearchResultContainer">
          {notifications.length === 0 ? (
            <h2>Not any notifications</h2>
          ) : (
            notifications.map((notification, i) => (
              <NotificationItem
                key={i}
                id={notification._id}
                avatar={notification.sender.avatar}
                name={notification.sender.name}
                username={notification.sender.username}
              />
            ))
          )}
        </SearchResultContainer>
      </div>
    </SearchWindowContainer>
  );
}

export default Notification;

function NotificationItem({ avatar, username, id }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutateRequest } = useAcceptRequest();
  const handleAcceptRequest = async () => {
    mutateRequest({
      requestId: id,
      accept: true,
    });
    queryClient.invalidateQueries("myGroups");
    queryClient.invalidateQueries("myChats");
    navigate("/");
    dispatch(setIsNotification(false));
  };

  const handleRejectRequest = async () => {
    mutateRequest({
      requestId: id,
      accept: false,
    });
    dispatch(setIsNotification(false));
  };

  return (
    <div className="result-item flex gap-4 items-center w-full justify-between border-2 rounded-full px-2 py-[0.1rem]">
      <ImageContainer className="ImageContainer">
        <img src={avatar} alt="avatar" />
      </ImageContainer>
      <span>{username}</span>

      <div>
        <Button onClick={handleRejectRequest}>
          <X size={15} color="red" weight="bold" />
        </Button>
        <Button onClick={handleAcceptRequest}>
          <Check size={15} color="green" weight="bold" />
        </Button>
      </div>
    </div>
  );
}

const SearchWindowContainer = styled.div`
  width: 300px;
  border-radius: 50px;
  height: 400px;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const Button = styled.button`
  border-radius: 100%;
  padding: 10px;

  &:hover {
    background-color: #b4d4f2;
    box-shadow: 0px 10px 20px 1px #3333331d;
  }
`;

const SearchResultContainer = styled.div`
  overflow-y: auto;
  max-height: 380px;
  font-size: 14px;
  display: flex;
  flex-grow: 4;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
`;

const ImageContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
  }
`;
