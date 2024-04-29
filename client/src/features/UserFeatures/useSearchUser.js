import { useQuery } from "@tanstack/react-query";
import { getSearchUser } from "../../services/apiUser";

export function useSearchUser(name) {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["searchUser"],
    queryFn: () => getSearchUser(name),
  });

  console.log(data);

  return { isLoading, error, data, refetch };
}
