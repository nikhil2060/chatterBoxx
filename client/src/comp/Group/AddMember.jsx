import { Check, Plus } from "@phosphor-icons/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useGetMyFriends } from "../../features/GroupFeatures/useGetMyFriends";
import { useAddGroupMembers } from "../../features/GroupFeatures/useMutateGroup ";
import { setIsAddGroupMember } from "../../redux/reducer/miscSlice";
import AddGroupMemberModal from "../../ui/AddGroupMemberModal";

function AddMember({ chatId }) {
  const { currentChatId } = useSelector((state) => state.chat);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { isLoading, error, myFriends } = useGetMyFriends(chatId);
  const dispatch = useDispatch();
  const { isAdding, mutateAdd } = useAddGroupMembers();

  if (error) console.error(error);

  if (isLoading) return <h1>Loading...</h1>;

  const handleAdd = () => {
    if (selectedMembers.length <= 0) {
      toast.error("Choose at least 1 members");
      return;
    }
    mutateAdd({ currentChatId, selectedMembers });
    setSelectedMembers([]);
    dispatch(setIsAddGroupMember(false));
  };

  const handleCancel = () => {
    setSelectedMembers([]);
    dispatch(setIsAddGroupMember(false));
  };

  return (
    <AddGroupMemberModal>
      <Container>
        <Title>Add member to group</Title>
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
          <CancelButton onClick={handleCancel} disabled={isAdding}>
            Cancel
          </CancelButton>
          <CreateButton onClick={handleAdd} disabled={isAdding}>
            Add
          </CreateButton>
        </ButtonContainer>
      </Container>
    </AddGroupMemberModal>
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
export default AddMember;
