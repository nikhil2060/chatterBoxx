import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptRequest } from "../../services/apiUser";
import toast from "react-hot-toast";
import { sendAttachments } from "../../services/apiChat";

export function useSendAttachments() {
  const queryClient = useQueryClient();

  const { isLoading: isSending, mutate: mutateSend } = useMutation({
    mutationFn: ({ formData, key }) => {
      return sendAttachments(formData, key);
    },
    onError: (err) => toast.error("Something went wrong"),
  });

  return { isSending, mutateSend };
}
