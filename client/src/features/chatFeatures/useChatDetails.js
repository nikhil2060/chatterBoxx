import { useQuery } from "@tanstack/react-query";
import { getChatDetails, getChatMessages } from "../../services/apiChat";

export function useGetChatDetails(currentChatId, populate = "false") {
  return useQuery({
    queryKey: ["chatDetails", currentChatId, populate],
    queryFn: () => getChatDetails(currentChatId, populate),
    enabled: !!currentChatId,
  });
}

export function useGetChatMessages(currentChatId, page = 1) {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["chatMessages"],
    queryFn: () => getChatMessages(currentChatId, page),
  });

  return { isLoading, error, data, refetch };
}
