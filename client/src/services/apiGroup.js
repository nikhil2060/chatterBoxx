import { getMyGroupsRoute } from "../utils/ChatRoutes";

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
