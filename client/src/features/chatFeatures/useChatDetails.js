import { useQuery } from "@tanstack/react-query";
import { getChatDetails } from "../../services/apiChat";

export function useGetChatDetails(currentChatId) {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["chatDetails"],
    queryFn: () => getChatDetails(currentChatId),
    enabled: !!currentChatId,
  });

  return { isLoading, error, data, refetch };
}
