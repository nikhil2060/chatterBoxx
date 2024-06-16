import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyFriends } from "../../services/apiUser";
import { removeGroupMember } from "../../services/apiGroup";
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
