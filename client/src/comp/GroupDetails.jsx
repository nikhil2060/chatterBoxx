import React, { useState } from "react";
import styled from "styled-components";
import { useGetChatDetails } from "../features/chatFeatures/useChatDetails";

function GroupDetails({ currentChatId }) {
  const { isLoading, error, data, refetch } = useGetChatDetails(
    currentChatId,
    "true"
  );

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // console.log(data);

  return (
    <ChatDetailsContainer>
      <Header>
        <h2>Group Name</h2>
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
        <Button>Add</Button>
        <Button>Remove</Button>
      </ButtonsContainer>
      <MembersList>
        {/* {myFriends?.map((friend, i) => (
          <MembersListItem
            friend={friend}
            setSelectedMembers={setSelectedMembers}
            selectedMembers={selectedMembers}
            key={i}
          />
        ))} */}
        <MembersListItem />
      </MembersList>
    </ChatDetailsContainer>
  );
}

const MembersListItem = ({ friend }) => {
  return (
    <MemberItem>
      <MemberImage>
        <img src={friend?.avatar} alt="" className="" />
      </MemberImage>
      <MemberName>{friend?.name}</MemberName>
    </MemberItem>
  );
};

const MemberImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 5px 10px;
  border: 1px solid #eee;
  border-radius: 50px;
`;

const MemberName = styled.span`
  font-size: 14px;
`;

const ChatDetailsContainer = styled.div`
  position: absolute;
  top: 70px;
  left: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 15px;
  border-radius: 0px 0px 0px 5px;
  box-shadow: 0px 0px 10px #3333335e;
  z-index: 10;
  color: #aaaaaa;
`;

const MembersList = styled.div`
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

export default GroupDetails;
