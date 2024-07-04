import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, getMyGroups } from "../../services/apiGroup";
import toast from "react-hot-toast";

export function useGetMyGroups() {
  const {
    isLoading,
    data: myGroups,
    error,
  } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });

  return { isLoading, error, myGroups };
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate: mutateCreate } = useMutation({
    mutationFn: ({ groupName, selectedMembers }) => {
      return createGroup(groupName, selectedMembers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("myGroups");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isCreating, mutateCreate };
}
