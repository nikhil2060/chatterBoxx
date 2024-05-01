import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../services/apiUser";

export function useGetNotifications() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    cacheTime: 0,
  });

  return { isLoading, error, data, refetch };
}
