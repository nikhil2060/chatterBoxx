import toast from "react-hot-toast";
import {
  getChatDetailsRoute,
  getMyChatsRoute,
  getChatMessagesRoute,
  sendAttachmentsRoute,
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

export async function getChatDetails(chatId, populate) {
  if (!chatId) return null;

  // console.log(`${getChatDetailsRoute}/${chatId}?populate=${populate}`);

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

    // console.log(chat);

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

export async function sendAttachments(formData, key) {
  try {
    const res = await fetch(sendAttachmentsRoute, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const data = await res.json();

    console.log(data);

    if (data.status) toast.success(`${key} sent successfully`);
    else toast.error(`failed to send ${key}`);

    return data;
  } catch (err) {
    throw Error("Failed in sending attachments", err);
  }
}
