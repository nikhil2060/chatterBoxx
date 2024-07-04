import { useQuery } from "@tanstack/react-query";
import { getMyFriends } from "../../services/apiUser";

export function useGetMyFriends() {
  const {
    isLoading,
    data: myFriends,
    error,
  } = useQuery({
    queryKey: ["myFriends"],
    queryFn: getMyFriends,
  });

  return { isLoading, error, myFriends };
}
