import { UserLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { IResponse } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const logsKeys = generateQueryKey("logs");

export const useGetLogs = () => {
  return useQuery({
    queryKey: logsKeys.all,
    queryFn: async () => {
      const result = await fetch(`/api/logs`);
      const response: IResponse<UserLog[]> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
  });
};
