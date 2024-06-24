// const host = `http://localhost:3000`;
const host = import.meta.env.VITE_SERVER;

console.log(host);

export const getSearchUserRoute = `${host}/api/auth/user/search?name=`;

export const sendRequestRoute = `${host}/api/auth/user/sendRequest`;

export const getNotificationsRoute = `${host}/api/auth/user/notifications`;

export const acceptRequestRoute = `${host}/api/auth/user/acceptRequest`;

export const getMyFriendsRoute = `${host}/api/auth/user/friends`;
