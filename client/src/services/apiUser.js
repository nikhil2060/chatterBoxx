import { getSearchUserRoute, sendRequestRoute } from "../utils/UserRoutes";

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

export async function sendRequest(userId) {
  try {
    const res = await fetch(sendRequestRoute, {
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const data = await res.json();

    return data;
  } catch (err) {
    throw Error("Failed in getting chat", err);
  }
}
