import { createContext, useContext } from "react";
import io from "socket.io-client";

const socketContext = createContext();

const useSocket = () => {
  //custom hook
  const socket = useContext(socketContext);

  if (socket === undefined) throw new Error("Socket is incorrectly used");

  return socket;
};

function SocketProvider({ children }) {
  const socket = io("localhost:3000", {
    withCredentials: "include",
  });

  return (
    <socketContext.provider value={{ socket }}>
      {children}
    </socketContext.provider>
  );
}

export { useSocket, SocketProvider };
