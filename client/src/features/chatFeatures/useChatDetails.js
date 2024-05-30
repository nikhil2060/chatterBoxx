import { useQuery } from "@tanstack/react-query";
import { getChatDetails, getChatMessages } from "../../services/apiChat";

export function useGetChatDetails(currentChatId, populate = "false") {
  console.log(currentChatId, populate);
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["chatDetails"],
    queryFn: () => getChatDetails(currentChatId, populate),
  });

  return { isLoading, error, data, refetch };
}

export function useGetChatMessages(currentChatId, page = 1) {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["chatMessages"],
    queryFn: () => getChatMessages(currentChatId, page),
  });

  return { isLoading, error, data, refetch };
}
