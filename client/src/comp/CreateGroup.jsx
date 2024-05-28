import React, { useState } from "react";
import CreateGroupModal from "../ui/CreateGroupModal";
import styled from "styled-components";
import { useGetMyFriends } from "../features/GroupFeatures/useGetMyFriends";
import { Check, Plus } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { setIsCreateGroup } from "../redux/reducer/miscSlice";
import { useCreateGroup } from "../features/GroupFeatures/useCreateGroup";
import toast from "react-hot-toast";

function CreateGroup({ chatId }) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { isLoading, error, myFriends } = useGetMyFriends(chatId);
  const dispatch = useDispatch();
  const { isCreating, mutateCreate } = useCreateGroup();

  if (error) console.error(error);

  if (isLoading) return <h1>Loading...</h1>;

  const handleCreate = () => {
    if (groupName == "") {
      toast.error("Enter group name");
      return;
    }

    if (selectedMembers.length < 2) {
      toast.error("Choose at least 2 members");
      return;
    }
    mutateCreate({ groupName, selectedMembers });
    setGroupName("");
    setSelectedMembers([]);
    dispatch(setIsCreateGroup(false));
  };

  const handleCancel = () => {
    setGroupName("");
    setSelectedMembers([]);
    dispatch(setIsCreateGroup(false));
  };

  return (
    <CreateGroupModal>
      <Container>
        <Title>New Group</Title>
        <Input
          value={groupName}
          type="text"
          placeholder="Group Name"
          onChange={(e) => setGroupName(e.target.value)}
        />
        <MembersList>
          {myFriends?.map((friend, i) => (
            <MembersListItem
              friend={friend}
              setSelectedMembers={setSelectedMembers}
              selectedMembers={selectedMembers}
              key={i}
            />
          ))}
        </MembersList>
        <ButtonContainer>
          <CancelButton onClick={handleCancel} disabled={isCreating}>
            Cancel
          </CancelButton>
          <CreateButton onClick={handleCreate} disabled={isCreating}>
            Create
          </CreateButton>
        </ButtonContainer>
      </Container>
    </CreateGroupModal>
  );
}

const MembersListItem = ({ friend, setSelectedMembers, selectedMembers }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleAddMember = () => {
    if (!isSelected) {
      setSelectedMembers([...selectedMembers, friend._id]);
      setIsSelected(true);
    }
  };

  return (
    <MemberItem>
      <MemberImage>
        <img src={friend.avatar} alt="" className="" />
      </MemberImage>
      <MemberName>{friend.name}</MemberName>
      <AddButton onClick={handleAddMember}>
        {!isSelected ? (
          <Plus size={20} weight="bold" />
        ) : (
          <Check size={20} weight="bold" />
        )}
      </AddButton>
    </MemberItem>
  );
};

const MemberImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
`;

const Container = styled.div`
  width: 280px;
  border-radius: 50px;
  height: 400px;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 50px;
  height: 40px;
  padding: 10px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #ccc;
  /* box-shadow: 0px 10px 20px 1px #3333331d; */
`;

const MembersList = styled.div`
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  padding: 10px;
  width: 30px;
  height: 30px;
  /* padding: 5px; */
  background: none;
  border: none;
  cursor: pointer;
  background-color: #b4d4f2;

  &:hover {
    box-shadow: 0px 00px 10px 0px #3333331d;
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin: 5px;
  flex-grow: 1;
`;

const CreateButton = styled(ActionButton)`
  background: #b4d4f2;
  color: white;
`;

const CancelButton = styled(ActionButton)`
  background: #ccc;
  color: black;
`;
export default CreateGroup;
