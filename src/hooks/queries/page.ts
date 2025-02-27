import { Page } from "@prisma/client";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { creditKeys, logsKeys, userStatsKeys } from "@/hooks";
import {
  IDeletePagesBy,
  IGetPageBy,
  IInvalidateCachePageBy,
  IUpdatePagesBy,
} from "@/services/page";
import { IResponse, IFilterParams } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const pageKeys = generateQueryKey("page");

export const useGetPages = ({
  siteId,
  pageSize = 10,
  search,
}: IGetPageBy & IFilterParams) => {
  return useInfiniteQuery({
    queryKey: pageKeys.list({ siteId, pageSize, search }),
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

      const url = `/api/sites/${siteId}/pages?${params.toString()}`;

      const result = await fetch(url, { signal });
      const response: IResponse<{
        data: Page[];
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
    enabled: !!siteId,
  });
};

export const useUpdatePageById = ({ siteId }: { siteId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cacheDurationDays }: IUpdatePagesBy) => {
      const result = await fetch(`/api/pages/${id}`, {
        method: "PUT",
        body: JSON.stringify({ cacheDurationDays }),
      });
      const response: IResponse<Page> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.list({ siteId }),
      });
    },
  });
};

export const useInvalidateCachePageById = ({ siteId }: { siteId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: Omit<IInvalidateCachePageBy, "userId">) => {
      const result = await fetch(`/api/pages/${id}/invalidate-cache`, {
        method: "POST",
      });
      const response: IResponse<Page> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.list({ siteId }),
      });
      queryClient.invalidateQueries({
        queryKey: creditKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: logsKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: userStatsKeys.all,
      });
    },
  });
};

export const useDeletePageById = ({ siteId }: { siteId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: IDeletePagesBy) => {
      const result = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });
      const response: IResponse<Page> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.list({ siteId }),
      });
      queryClient.invalidateQueries({
        queryKey: userStatsKeys.all,
      });
    },
  });
};
