import React from "react";
import styled from "styled-components";

function MessageSenderPhoto({ att }) {
  return (
    <OuterDiv>
      <ImgDiv>
        <a href={att.url} target="_blank" rel="noopener noreferrer">
          <img src={att.url} alt="sender image" />
        </a>
      </ImgDiv>
    </OuterDiv>
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

const ImgDiv = styled.div`
  margin-left: 3px;
  width: 30px;
  min-width: 30px;
  min-height: 30px;
  overflow: hidden;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export default MessageSenderPhoto;
