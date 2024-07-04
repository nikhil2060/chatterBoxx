import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendAttachments } from "../../services/apiChat";

export function useSendAttachments() {
  const { isLoading: isSending, mutate: mutateSend } = useMutation({
    mutationFn: ({ formData, key }) => {
      return sendAttachments(formData, key);
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { isSending, mutateSend };
}
