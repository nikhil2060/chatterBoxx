import toast from "react-hot-toast";
import { createGroupRoute, getMyGroupsRoute } from "../utils/GroupRoutes";

export async function getMyGroups() {
  try {
    const res = await fetch(getMyGroupsRoute, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const { groups } = await res.json();

    return groups;
  } catch (err) {
    throw Error("Failed in getting groups", err);
  }
}

export async function createGroup(name, members) {
  if (name == "" || members.length == 0) return;

  console.log(name, members);

  try {
    const res = await fetch(createGroupRoute, {
      body: JSON.stringify({ name, members }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw Error();

    const data = await res.json();

    console.log(data);

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
