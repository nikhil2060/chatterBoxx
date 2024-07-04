import {
  MagnifyingGlass,
  UserCircleCheck,
  UserPlus,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSearchUser } from "../features/UserFeatures/useSearchUser";
import { sendRequest } from "../services/apiUser";

function SearchWindow() {
  const [name, setName] = useState(""); // eslint-disable-line no-unused-vars
  const queryClient = useQueryClient(); // Initialize queryClient

  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.invalidateQueries(["searchUser", name]);
    }, 500); // Adjust the debounce time as needed (e.g., 500 milliseconds)

    return () => clearTimeout(timer);
  }, [name, queryClient]);

  const { isLoading, error, data: users } = useSearchUser(name);

  if (isLoading) return <h1>LOADING...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  return (
    <SearchWindowContainer>
      <InputDiv>
        <Input
          type="text"
          placeholder="Search"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button>
          <MagnifyingGlass size={20} />
        </Button>
      </InputDiv>
      <SearchResultContainer className="SearchResultContainer">
        {name === "" || users.length === 0 ? (
          <h2>No user found</h2>
        ) : (
          users.map((user, i) => (
            <ResultItem
              key={i}
              id={user._id}
              avatar={user.avatar}
              name={user.name}
              username={user.username}
            />
          ))
        )}
      </SearchResultContainer>
    </SearchWindowContainer>
  );
}

export default SearchWindow;

function ResultItem({ avatar, username, id }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendRequest = async () => {
    const data = await sendRequest(id);

    if (data.status === true) {
      toast.success(data.msg);
      setIsSubmitted(true);
    } else {
      toast.error(data.msg);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="result-item flex gap-4 items-center w-full justify-between border-2 rounded-full px-2 py-1">
      <ImageContainer className="ImageContainer">
        <img src={avatar} alt="avatar" />
      </ImageContainer>
      <span>{username}</span>
      <Button onClick={handleSendRequest}>
        {!isSubmitted ? (
          <UserPlus size={20} />
        ) : (
          <UserCircleCheck size={25} color="green" />
        )}
      </Button>
    </div>
  );
}

const SearchWindowContainer = styled.div`
  width: 280px;
  border-radius: 50px;
  height: 400px;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const InputDiv = styled.div`
  width: 280px;
  border-radius: 50px;
  min-height: 40px;
  font-weight: 400;
  font-size: 12px;
  box-shadow: 0px 10px 20px 1px #3333331d;
  display: flex;
  overflow: hidden;
`;

const Input = styled.input`
  width: 250px;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  height: 40px;
  padding: 10px;
  font-weight: 400;
  font-size: 12px;
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
