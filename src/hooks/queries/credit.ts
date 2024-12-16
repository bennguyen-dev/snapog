import { UserBalance } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { IResponse } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const creditKeys = generateQueryKey("credit");

export const useGetCredits = () => {
  return useQuery({
    queryKey: creditKeys.all,
    queryFn: async () => {
      const result = await fetch(`/api/credits`);
      const response: IResponse<UserBalance> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
  });
};
