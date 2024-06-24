// const host = `http://localhost:3000`;
const host = import.meta.env.VITE_SERVER;

// import { server as host } from "../contants/config";

export const registerRoute = `${host}/api/auth/user/register`;

export const loginRoute = `${host}/api/auth/user/login`;

export const logOutRoute = `${host}/api/auth/user/logout`;

export const getMyProfileRoute = `${host}/api/auth/user/me`;

export const uploadPic = `${host}/api/auth/uploadpic`;

export const allUserRoute = `${host}/api/auth/allusers`;
