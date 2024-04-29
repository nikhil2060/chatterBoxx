import { getSearchUserRoute } from "../utils/UserRoutes";

export async function getSearchUser(username) {
  // if (username === "") return [];

  try {
    const res = await fetch(`${getSearchUserRoute}${username}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const { users } = await res.json();

    return users;
  } catch (err) {
    throw Error("Failed in getting chat", err);
  }
}
