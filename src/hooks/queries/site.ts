import { Site } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { logsKeys, pageKeys, userStatsKeys } from "@/hooks";
import { ICreateSite, IDeleteSitesBy, IUpdateSiteBy } from "@/services/site";
import { IResponse, IFilterParams } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const siteKeys = generateQueryKey("site");

export const useGetSites = ({ pageSize = 10, search }: IFilterParams) => {
  return useInfiniteQuery({
    queryKey: siteKeys.list({ pageSize, search }),
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

      const url = `/api/sites?${params.toString()}`;

      const result = await fetch(url, { signal });
      const response: IResponse<{
        data: Site[];
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

export const useGetSiteById = ({ siteId }: { siteId: string }) => {
  return useQuery({
    queryKey: siteKeys.detail(siteId),
    queryFn: async () => {
      const result = await fetch(`/api/sites/${siteId}`);
      const response: IResponse<Site> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    enabled: !!siteId,
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cacheDurationDays,
      domain,
    }: Omit<ICreateSite, "userId">) => {
      const result = await fetch("/api/sites", {
        method: "POST",
        body: JSON.stringify({ cacheDurationDays, domain }),
      });
      const response: IResponse<Site> = await result.json();

      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: siteKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: pageKeys.list({ siteId: data.data.id }),
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

export const useUpdateSiteById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      cacheDurationDays,
      overridePage,
    }: IUpdateSiteBy) => {
      const result = await fetch(`/api/sites/${id}`, {
        method: "PUT",
        body: JSON.stringify({ cacheDurationDays, overridePage }),
      });
      const response: IResponse<Site> = await result.json();

      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: siteKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: pageKeys.list({ siteId: data.data.id }),
      });
    },
  });
};

export const useDeleteSiteById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: IDeleteSitesBy) => {
      const result = await fetch(`/api/sites/${id}`, {
        method: "DELETE",
      });
      const response = await result.json();

      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: userStatsKeys.all,
      });
    },
  });
};
