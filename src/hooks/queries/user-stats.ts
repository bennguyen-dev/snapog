import { useQuery } from "@tanstack/react-query";

import { IStatsResponse } from "@/services/stats";
import { IResponse } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const userStatsKeys = generateQueryKey("user-stats");

export const useGetUserStats = () => {
  return useQuery({
    queryKey: userStatsKeys.all,
    queryFn: async () => {
      const result = await fetch("/api/user/stats");
      const response: IResponse<IStatsResponse> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
  });
};
