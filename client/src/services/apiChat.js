import { getChatDetailsRoute, getMyChatsRoute } from "../utils/ChatRoutes";

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

export async function getChatDetails(chatId, populate = false) {
  if (!chatId) return null;
  try {
    const res = await fetch(
      `${getChatDetailsRoute}/${chatId}?populate=${populate}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) throw Error();

    const { chat } = await res.json();

    return chat;
  } catch (err) {
    throw Error("Failed in getting chat", err);
  }
}
