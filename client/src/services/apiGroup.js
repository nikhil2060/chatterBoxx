import toast from "react-hot-toast";
import {
  addGroupMembersRoute,
  createGroupRoute,
  getMyGroupsRoute,
  removeGroupMemberRoute,
} from "../utils/GroupRoutes";
import { getChatDetailsRoute, leaveGroupRoute } from "../utils/ChatRoutes";

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

export async function removeGroupMember(chatId, userId) {
  try {
    const res = await fetch(removeGroupMemberRoute, {
      body: JSON.stringify({ chatId, userId }),
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
    throw Error("Failed in removing member from group", err);
  }
}

export async function AddGroupMembers(chatId, members) {
  try {
    const res = await fetch(addGroupMembersRoute, {
      body: JSON.stringify({ chatId, members }),
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
    throw Error("Failed in Adding members in group", err);
  }
}

export async function deleteGroupChat(chatId) {
  try {
    const res = await fetch(`${getChatDetailsRoute}/${chatId}`, {
      method: "DELETE",
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
    throw Error("Failed in deleting the group", err);
  }
}

export async function leaveGroup(chatId) {
  try {
    const res = await fetch(`${leaveGroupRoute}/${chatId}`, {
      method: "DELETE",
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
    throw Error("Failed in Leaving the group", err);
  }
}

export async function renameGroup(chatId, name) {
  try {
    const res = await fetch(`${getChatDetailsRoute}/${chatId}`, {
      body: JSON.stringify({ chatId, name }),
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
    throw Error("Failed in Renaming the group", err);
  }
}
