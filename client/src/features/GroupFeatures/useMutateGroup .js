import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyFriends } from "../../services/apiUser";
import {
  AddGroupMembers,
  deleteGroupChat,
  removeGroupMember,
} from "../../services/apiGroup";
import toast from "react-hot-toast";

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
    onError: (err) => toast.error("Something went wrong"),
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
    onError: (err) => toast.error("Something went wrong"),
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
    onError: (err) => toast.error("Something went wrong"),
  });

  return { isDeleting, mutateDelete };
}
