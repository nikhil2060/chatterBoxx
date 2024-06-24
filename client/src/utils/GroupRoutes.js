// const host = `http://localhost:3000`;
const host = import.meta.env.VITE_SERVER;

export const getMyGroupsRoute = `${host}/api/chat/my/groups`;

export const createGroupRoute = `${host}/api/chat/createNewGroup`;

export const removeGroupMemberRoute = `${host}/api/chat/removeMember`;

export const addGroupMembersRoute = `${host}/api/chat/addMembers`;
