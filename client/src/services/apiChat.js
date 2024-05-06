import {
  getChatDetailsRoute,
  getMyChatsRoute,
  getChatMessagesRoute,
} from "../utils/ChatRoutes";

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

export async function getChatMessages(chatId, page = 1) {
  if (!chatId) return null;

  try {
    const res = await fetch(`${getChatMessagesRoute}/${chatId}?page=${page}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const data = await res.json();

    return data;
  } catch (err) {
    throw Error("Failed in getting chat", err);
  }
}
