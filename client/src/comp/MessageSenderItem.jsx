import React from "react";
import styled from "styled-components";

function MessageSenderItem({ children }) {
  return (
    <div className="w-full flex justify-start">
      <OuterDiv>
        {/* <ImgDiv>
          <img src="/userIcon.jpeg" alt="sender image" />
        </ImgDiv> */}
        <ContentDiv>{children}</ContentDiv>
      </OuterDiv>
    </div>
  );
}

const OuterDiv = styled.div`
  background-color: #ffffff;
  max-width: 70%; /* Allow it to grow up to 70% of its container */
  padding: 10px;
  text-align: left;
  border-radius: 0px 20px 20px 20px;

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 12px;
  box-shadow: 0px 0px 15px #3333332a;

  word-wrap: break-word; /* Ensure long words break to a new line */
  overflow: hidden;
`;

const ContentDiv = styled.div`
  flex: 1; /* Allow content to take up available space */
  word-break: break-word; /* Ensure content breaks correctly */
  padding: 5px;
`;

const ImgDiv = styled.div`
  width: 30px;
  min-height: 30px;
  overflow: hidden;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
`;

export default MessageSenderItem;
