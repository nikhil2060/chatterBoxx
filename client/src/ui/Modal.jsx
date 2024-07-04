import { XCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setIsSearch } from "../redux/reducer/miscSlice";

function Modal({ children }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const handleClose = () => {
    dispatch(setIsSearch(false));
  };

  const { isSearch } = useSelector((state) => state.misc);

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(setIsSearch(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearch, handleClickOutside]);

  return (
    <Overlay>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
      >
        <StyledModal ref={modalRef}>
          <Button onClick={handleClose}>
            <XCircle size={20} color="red" />
          </Button>
          <div>{children}</div>
        </StyledModal>
      </motion.div>
    </Overlay>
  );
}

export default Modal;

const StyledModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(6px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    color: var(--color-grey-500);
  }
`;
