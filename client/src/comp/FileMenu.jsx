import { File, Headphones, Image } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

function FileMenu() {
  const [menuLoaded, setMenuLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuLoaded(true);
    }, 5);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StyledMenu menuLoaded={menuLoaded}>
      <StyledItem>
        <Image size={15} />
        <span>Image</span>
      </StyledItem>
      <StyledItem>
        <Headphones size={15} />
        <span>Audio</span>
      </StyledItem>
      <StyledItem>
        <File size={15} />
        <span>File</span>
      </StyledItem>
    </StyledMenu>
  );
}

const StyledMenu = styled.div`
  position: absolute;
  bottom: ${({ menuLoaded }) => (menuLoaded ? "70px" : "0")};
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #f4f4f5;
  padding: 15px;
  border-radius: 0px 20px 0px 0px;
  box-shadow: 0px 0px 10px #33333330;
  transition: bottom 0.5s ease;
  z-index: 10;
`;

const StyledItem = styled.div`
  /* width: 40px; */
  background-color: #b4d4f2;
  font-size: 12px;
  padding: 4px 10px 4px 10px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    transform: scale(1.06);
  }
`;

export default FileMenu;
