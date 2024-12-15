import { Page } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IDeletePagesBy, IUpdatePagesBy } from "@/services/page";
import { IResponse } from "@/types/global";
import generateQueryKey from "@/utils/queryKeyFactory";

export const pageKeys = generateQueryKey("page");

export const useGetPages = ({ siteId }: { siteId: string }) => {
  return useQuery({
    queryKey: pageKeys.list({ siteId }),
    queryFn: async () => {
      const result = await fetch(`/api/sites/${siteId}/pages`);
      const response: IResponse<Page[]> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
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
    },
  });
};
