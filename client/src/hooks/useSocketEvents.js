import { useCallback, useEffect } from "react";
import { NEW_MESSAGE } from "../contants/event";

function useSocketEvents(socket, handlers) {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handlers]) => {
      socket.on(event, handlers);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handlers]) => {
        socket.off(event, handlers);
      });
    };
  }, [socket, handlers]);
}

export default useSocketEvents;
