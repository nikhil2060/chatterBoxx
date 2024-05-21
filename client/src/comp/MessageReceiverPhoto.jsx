import React from "react";
import styled from "styled-components";

function MessageReceiverPhoto({ att }) {
  return (
    <div className="w-full flex justify-end">
      <OuterDiv>
        <ImgLink href={att.url} target="_blank" rel="noopener noreferrer">
          <img src={att.url} alt="receiver image" />
        </ImgLink>
      </OuterDiv>
    </div>
  );
}

const OuterDiv = styled.div`
  background-color: #b4d4f2;
  width: 30%;
  padding: 10px;
  text-align: left;
  border-radius: 20px 0px 20px 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1px;

  font-size: 12px;
  box-shadow: 0px 0px 15px #3333332a;
`;

const ImgLink = styled.a`
  overflow: hidden;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff55;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export default MessageReceiverPhoto;
