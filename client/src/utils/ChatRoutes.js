// const host = `http://localhost:3000`;
const host = import.meta.env.VITE_SERVER;

export const getMyChatsRoute = `${host}/api/chat/my`;

export const getChatDetailsRoute = `${host}/api/chat`;

export const getChatMessagesRoute = `${host}/api/chat/message`;

export const sendAttachmentsRoute = `${host}/api/chat/message`;

export const leaveGroupRoute = `${host}/api/chat/leave`;
