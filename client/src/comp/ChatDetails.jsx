import React from "react";
import styled from "styled-components";
import { useGetChatDetails } from "../features/chatFeatures/useChatDetails";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteGroup } from "../features/GroupFeatures/useMutateGroup ";
import { useNavigate } from "react-router-dom";
import { setCurrentChat } from "../redux/reducer/chatSlice";

function ChatDetails({ currentChatId }) {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isLoading, error, data } = useGetChatDetails(currentChatId, "true");

  const { isDeleting, mutateDelete } = useDeleteGroup();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const otherMember = data.members.filter((mem) => mem._id !== user._id);

  const handleDeleteGroup = () => {
    mutateDelete({ currentChatId });
    dispatch(setCurrentChat(""));
    navigate("/");
  };

  return (
    <ChatDetailsContainer>
      <Header>
        <h2>{otherMember[0]?.username || "No other members"}</h2>
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
  padding: 15px;
  border-radius: 0px 0px 5px 5px;
  /* box-shadow: 0px 0px 10px #3333335e; */
  z-index: 10;
  color: #aaaaaa;
`;

const Header = styled.div`
  text-align: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
`;

const UserName = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

const PhoneNumber = styled.div`
  text-align: center;
  color: #ccc;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
`;

const Button = styled.button`
  background-color: #b3d3f1;
  font-size: 10px;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 59px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Option = styled.div`
  background-color: #333;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

export default ChatDetails;
