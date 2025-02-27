import { UserLog } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { IResponse, IFilterParams } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const logsKeys = generateQueryKey("logs");

export const useGetLogs = ({
  pageSize = 10,
  search,
  filter,
}: IFilterParams) => {
  return useInfiniteQuery({
    queryKey: logsKeys.list({ pageSize, search, filter }),
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

      // Add filter as a JSON string if it exists and has properties
      if (filter && Object.keys(filter).length > 0) {
        // Format dates if they are Date objects
        const formattedFilter = { ...filter };

        if (filter.dateFrom instanceof Date) {
          formattedFilter.dateFrom = filter.dateFrom.toISOString();
        }

        if (filter.dateTo instanceof Date) {
          formattedFilter.dateTo = filter.dateTo.toISOString();
        }

        params.append("filter", JSON.stringify(formattedFilter));
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
