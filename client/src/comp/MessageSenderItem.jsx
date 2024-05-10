import React from "react";
import styled from "styled-components";

function MessageSenderItem({ children }) {
  return (
    <div className="w-full flex justify-start">
      <OuterDiv>
        <ImgDiv>
          <img src="/userIcon.jpeg" alt="sender image" />
        </ImgDiv>

        <div>{children}</div>
      </OuterDiv>
    </div>
  );
}

const OuterDiv = styled.div`
  background-color: #ffffff;
  width: 30%;
  padding: 10px;
  text-align: left;
  border-radius: 0px 20px 20px 20px;

  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  gap: 10px;

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

export default MessageSenderItem;
