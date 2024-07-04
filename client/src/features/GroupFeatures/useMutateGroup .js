import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  AddGroupMembers,
  deleteGroupChat,
  leaveGroup,
  removeGroupMember,
  renameGroup,
} from "../../services/apiGroup";

export function useRemoveGroupMember() {
  const queryClient = useQueryClient();
  const { isLoading: isRemoving, mutate: mutateRemove } = useMutation({
    mutationFn: ({ currentChatId, memberId }) => {
      return removeGroupMember(currentChatId, memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("myGroups");
      queryClient.invalidateQueries("myChats");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isRemoving, mutateRemove };
}

export function useAddGroupMembers() {
  const queryClient = useQueryClient();
  const { isLoading: isAdding, mutate: mutateAdd } = useMutation({
    mutationFn: ({ currentChatId, selectedMembers }) => {
      return AddGroupMembers(currentChatId, selectedMembers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("myGroups");
      queryClient.invalidateQueries("myChats");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isAdding, mutateAdd };
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: ({ currentChatId }) => {
      return deleteGroupChat(currentChatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("myGroups");
      queryClient.invalidateQueries("myChats");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isDeleting, mutateDelete };
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const { isLoading: isLeaving, mutate: mutateLeave } = useMutation({
    mutationFn: ({ currentChatId }) => {
      return leaveGroup(currentChatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("myGroups");
      queryClient.invalidateQueries("myChats");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isLeaving, mutateLeave };
}

export function useRenameGroup() {
  const queryClient = useQueryClient();
  const { isLoading: isRenaming, mutate: mutateRename } = useMutation({
    mutationFn: ({ currentChatId, newGroupName }) => {
      return renameGroup(currentChatId, newGroupName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("myGroups");
      queryClient.invalidateQueries("myChats");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isRenaming, mutateRename };
}
