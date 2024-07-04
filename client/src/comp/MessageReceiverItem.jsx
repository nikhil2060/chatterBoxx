import React from "react";
import styled from "styled-components";

function MessageReceiverItem({ message }) {
  const { content, createdAt } = message;
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="w-full flex justify-end">
      <OuterDiv>
        <ContentDiv>
          <HeaderDiv>
            <TimeDiv>{formattedTime}</TimeDiv>
          </HeaderDiv>
          {content}
        </ContentDiv>
      </OuterDiv>
    </div>
  );
}

const OuterDiv = styled.div`
  background-color: #ffffff;
  max-width: 70%; /* Allow it to grow up to 70% of its container */
  padding: 10px;
  text-align: left;
  border-radius: 20px 0px 20px 20px;

  display: flex;
  align-items: flex-start; /* Align items to the top */
  gap: 10px;

  font-size: 12px;
  box-shadow: 0px 0px 15px #3333332a;

  word-wrap: break-word; /* Ensure long words break to a new line */
  overflow: hidden;
`;

// const ImgDiv = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   overflow: hidden;
//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }
// `;

const ContentDiv = styled.div`
  flex: 1; /* Allow content to take up available space */
  word-break: break-word; /* Ensure content breaks correctly */
  padding: 5px;
`;

const HeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px; /* Space between header and message content */
`;

const TimeDiv = styled.div`
  font-size: 10px;
  color: #666;
`;

export default MessageReceiverItem;
