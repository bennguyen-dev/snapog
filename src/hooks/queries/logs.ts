import { UserLog } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { IResponse, ISearchParams } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const logsKeys = generateQueryKey("logs");

export const useGetLogs = ({ pageSize = 10, search }: ISearchParams) => {
  return useInfiniteQuery({
    queryKey: logsKeys.list({ pageSize, search }),
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams();

      params.append("pageSize", String(pageSize));
      if (pageParam) {
        params.append("cursor", pageParam);
      }
      if (search) {
        params.append("search", search);
      }

      const url = `/api/logs?${params.toString()}`;

      const result = await fetch(url, { signal });
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
