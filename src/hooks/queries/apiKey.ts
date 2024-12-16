import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { IRegenerateApiKeyResponse } from "@/services/user";
import { IResponse } from "@/types/global";

export const useRegenerateApiKey = () => {
  const { data: session, update } = useSession();

  return useMutation({
    mutationFn: async ({}: object) => {
      const result = await fetch(`/api/api-keys/regenerate`, {
        method: "POST",
      });
      const response: IResponse<IRegenerateApiKeyResponse> =
        await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: async (data) => {
      await update({
        ...session,
        user: {
          ...session?.user,
          apiKey: data.data.apiKey,
        },
      });
    },
  });
};
