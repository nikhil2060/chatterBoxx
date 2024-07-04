import { XCircle } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  useDeleteGroup,
  useLeaveGroup,
  useRemoveGroupMember,
  useRenameGroup,
} from "../features/GroupFeatures/useMutateGroup ";
import { useGetChatDetails } from "../features/chatFeatures/useChatDetails";
import { setCurrentChat } from "../redux/reducer/chatSlice";
import { setIsAddGroupMember } from "../redux/reducer/miscSlice";

function GroupDetails({ currentChatId }) {
  const navigate = useNavigate();

  const { isLoading, error, data } = useGetChatDetails(currentChatId, "true");

  const { mutateRemove } = useRemoveGroupMember();
  const { mutateDelete } = useDeleteGroup();
  const { mutateLeave } = useLeaveGroup();
  const { mutateRename } = useRenameGroup();

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // console.log(data);

  const handleRemove = (memberId) => {
    mutateRemove({ currentChatId, memberId });
  };

  const handleAddMember = () => {
    dispatch(setIsAddGroupMember(true));
  };

  const handleDeleteGroup = () => {
    mutateDelete({ currentChatId });
    dispatch(setCurrentChat(""));
    navigate("/");
  };

  const handleLeaveGroup = () => {
    mutateLeave({ currentChatId });
    dispatch(setCurrentChat(""));
    navigate("/");
  };

  const handleRenameGroup = () => {
    mutateRename({ currentChatId, newGroupName });
    setIsEditing(false);
    setNewGroupName("");
  };

  return (
    <ChatDetailsContainer>
      <ImageContainer>
        <img
          src={
            data?.groupAvatar ||
            "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png"
          }
          alt="Profile"
        />
      </ImageContainer>
      <UserName>
        {isEditing ? (
          <>
            <Input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button onClick={handleRenameGroup}>Save</Button>
          </>
        ) : (
          <>
            <div onClick={() => setIsEditing(true)} title="rename group">
              {" "}
              {data?.name || "Name"}
            </div>

            {/* <EditButton onClick={() => setIsEditing(true)}>
              <PencilSimple size={20} />
            </EditButton> */}
          </>
        )}
      </UserName>
      <ButtonsContainer>
        <Button onClick={handleAddMember}>Add Member</Button>
        <Button onClick={handleDeleteGroup}>Delete Group</Button>
        <Button onClick={handleLeaveGroup}>Leave Group</Button>
      </ButtonsContainer>
      <h4>Members:</h4>
      <MembersList>
        {data?.members?.map((member, i) => (
          <MembersListItem key={i} friend={member} onRemove={handleRemove} />
        ))}
      </MembersList>
    </ChatDetailsContainer>
  );
}

const MembersListItem = ({ friend, onRemove }) => (
  <MemberItem>
    <MemberImage>
      <img src={friend?.avatar} alt="" />
    </MemberImage>
    <MemberName>{friend?.name}</MemberName>
    <RemoveButton onClick={() => onRemove(friend?._id)} title="remove member">
      <XCircle size={20} color="red" />
    </RemoveButton>
  </MemberItem>
);

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  margin-right: 10px;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    color: var(--color-grey-500);
  }
`;

const MemberImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #eee;
  border-radius: 50px;
  justify-content: space-between;
`;

const MemberName = styled.span`
  font-size: 14px;
  margin-left: 10px;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 50px;
  height: 40px;
  padding: 10px;
  font-weight: 400;
  color: #555;
  font-size: 14px;
  border: 1px solid #ccc;
  /* box-shadow: 0px 10px 20px 1px #3333331d; */
`;

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

const MembersList = styled.div`
  max-height: 200px; /* Adjust height to display 3 members */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

  input {
    margin: 5px 0;
    padding: 5px;
    font-size: 14px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
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

export default GroupDetails;
