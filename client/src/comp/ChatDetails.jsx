import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useGetChatDetails } from "../features/chatFeatures/useChatDetails";

import { useNavigate } from "react-router-dom";
import { useDeleteGroup } from "../features/GroupFeatures/useMutateGroup ";
import { setCurrentChat } from "../redux/reducer/chatSlice";

function ChatDetails({ currentChatId }) {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error, data } = useGetChatDetails(currentChatId, "true");

  const { mutateDelete } = useDeleteGroup();

  if (isLoading) return <Loading>Loading...</Loading>;
  if (error) return <Error>Error: {error.message}</Error>;

  const otherMember = data.members.filter((mem) => mem._id !== user._id);

  const handleDeleteGroup = () => {
    mutateDelete({ currentChatId });
    dispatch(setCurrentChat(""));
    navigate("/");
  };

  return (
    <ChatDetailsContainer>
      <Header>
        <h5>{otherMember[0]?.username || "No other members"}</h5>
      </Header>
      <ImageContainer>
        <img
          src={
            otherMember[0]?.avatar ||
            "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png"
          }
          alt="Profile"
        />
      </ImageContainer>
      <UserName>{otherMember[0]?.name || "Name not available"}</UserName>
      <Bio>{otherMember[0]?.bio || "No bio available"}</Bio>
      <ButtonsContainer>
        <Button onClick={handleDeleteGroup}>Remove friend</Button>
      </ButtonsContainer>
    </ChatDetailsContainer>
  );
}

const ChatDetailsContainer = styled.div`
  position: absolute;
  top: 71px;
  left: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 0px 0px 10px 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  color: #333;
`;

const Header = styled.div`
  text-align: center;
  font-size: 1rem;
  color: #444;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #ddd;
  }
`;

const UserName = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
`;

const Bio = styled.div`
  text-align: center;
  font-size: 1rem;
  font-style: italic;
  color: #777;
  margin-bottom: 20px;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #999;
`;

const Error = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #b3d3f1;
  font-size: 0.875rem;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a3c3e1;
  }
`;

export default ChatDetails;
