import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";

const socketContext = createContext();

const serverUrl = import.meta.env.VITE_SERVER;

const useSocket = () => {
  //custom hook
  const socket = useContext(socketContext);

  if (socket === undefined) throw new Error("Socket is incorrectly used");

  return socket;
};

function SocketProvider({ children }) {
  const socket = useMemo(() => {
    return io(serverUrl, {
      withCredentials: "include",
    });
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

export { useSocket, SocketProvider };
