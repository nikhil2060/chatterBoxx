import React from "react";
import styled from "styled-components";
import { useGetChatDetails } from "../features/chatFeatures/useChatDetails";

function ChatDetails({ currentChatId }) {
    
    

  return (
    <ChatDetailsContainer>
      <Header>
        <h2>username</h2>
      </Header>
      <ImageContainer>
        <img
          src="https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png"
          alt="Profile"
        />
      </ImageContainer>
      <UserName>Name</UserName>
      <PhoneNumber>this is bio</PhoneNumber>
      <ButtonsContainer>
        <Button>Audio</Button>
        <Button>Video</Button>
        <Button>Search</Button>
      </ButtonsContainer>
      <OptionsContainer>
        <Option>Media, links and docs</Option>
        <Option>Starred messages</Option>
      </OptionsContainer>
    </ChatDetailsContainer>
  );
}

const ChatDetailsContainer = styled.div`
  position: absolute;
  top: 70px;
  left: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #969494;
  padding: 15px;
  border-radius: 0px 0px 0px 5px;
  box-shadow: 0px 0px 10px #33333330;
  z-index: 10;
  color: white;
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
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
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
