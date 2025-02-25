import { UserLog } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { IResponse } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const logsKeys = generateQueryKey("logs");

export const useGetLogs = ({ pageSize = 10 }: { pageSize?: number }) => {
  return useInfiniteQuery({
    queryKey: logsKeys.list({ pageSize }),
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const url = `/api/logs?pageSize=${pageSize}${
        pageParam ? `&cursor=${pageParam}` : ""
      }`;
      const result = await fetch(url);
      const response: IResponse<{
        data: UserLog[];
        nextCursor: string | null;
      }> = await result.json();

      if (response.status === 200 && response.data) {
        return {
          ...response,
          data: response.data.data,
          nextCursor: response.data.nextCursor,
        };
      }
      throw new Error(response.message);
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};
