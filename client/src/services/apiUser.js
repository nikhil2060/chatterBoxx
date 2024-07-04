import toast from "react-hot-toast";
import {
  acceptRequestRoute,
  getMyFriendsRoute,
  getNotificationsRoute,
  getSearchUserRoute,
  sendRequestRoute,
} from "../utils/UserRoutes";

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
    throw Error("Failed in getting user", err);
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
    throw Error("Failed in sending request", err);
  }
}

export async function getNotifications() {
  try {
    const res = await fetch(getNotificationsRoute, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const data = await res.json();

    return data;
  } catch (err) {
    throw Error("Failed in getting notifications", err);
  }
}

export async function acceptRequest(requestId, accept) {
  try {
    const res = await fetch(acceptRequestRoute, {
      body: JSON.stringify({ requestId, accept }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const data = await res.json();

    if (data.status === true) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }

    return data;
  } catch (err) {
    throw Error("Failed in sending request", err);
  }
}

export async function getMyFriends() {
  let url = getMyFriendsRoute;

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const { friends } = await res.json();

    return friends;
  } catch (err) {
    throw Error("Failed in getting friends", err);
  }
}
