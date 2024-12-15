import { Site } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ICreateSite, IDeleteSitesBy, IUpdateSiteBy } from "@/services/site";
import { IResponse } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const keys = generateQueryKey("site");

export const useGetSites = () => {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await fetch("/api/sites");
      const result: IResponse<Site[]> = await res.json();

      return result.data;
    },
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
      const response: IResponse<Site | null> = await result.json();

      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.all,
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
      const response: IResponse<Site | null> = await result.json();

      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.all,
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
        queryKey: keys.all,
      });
    },
  });
};
