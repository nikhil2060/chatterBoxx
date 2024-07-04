import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { acceptRequest, getNotifications } from "../../services/apiUser";

export function useGetNotifications() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    cacheTime: 0,
  });

  return { isLoading, error, data, refetch };
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  const { isLoading: isAccepting, mutate: mutateRequest } = useMutation({
    mutationFn: ({ requestId, accept }) => {
      acceptRequest(requestId, accept);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    cacheTime: 0,
    onError: () => toast.error("Something went wrong"),
  });

  return { isAccepting, mutateRequest };
}
