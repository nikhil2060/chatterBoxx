import { useDispatch } from "react-redux";
import { getMyChatsRoute } from "../utils/ChatRoutes";

export async function getMyChats() {
  try {
    const res = await fetch(getMyChatsRoute, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const { chats } = await res.json();

    return chats;
  } catch (err) {
    throw Error("Failed in getting chat", err);
  }
}
