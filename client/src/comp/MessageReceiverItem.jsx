import React from "react";
import styled from "styled-components";

function MessageReceiverItem({ children }) {
  return (
    <div className="w-full flex justify-end">
      <OuterDiv>
        <div className="pl-2">{children}</div>
        <ImgDiv>
          <img src="/userIcon.jpeg" alt="sender image" />
        </ImgDiv>
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
  align-items: start;
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
`;

export default MessageReceiverItem;
