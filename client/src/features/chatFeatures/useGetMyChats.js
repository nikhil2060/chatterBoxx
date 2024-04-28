import { useQuery } from "@tanstack/react-query";
import { getMyChats } from "../../services/apiChat";
import { useDispatch } from "react-redux";

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
