import { useQuery } from "@tanstack/react-query";
import { getMyChats, getMyGroups } from "../../services/apiChat";

export function useGetMyChats() {
  const {
    isLoading,
    data: myChats,
    error,
  } = useQuery({
    queryKey: ["myChats"],
    queryFn: getMyChats,
  });

  return { isLoading, error, myChats };
}

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
