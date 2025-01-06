import { useMutation } from "@tanstack/react-query";

import { IGetCheckoutUrl, IGetCheckoutUrlResponse } from "@/services/product";
import { IResponse } from "@/types/global";

export const useGetCheckoutUrl = () => {
  return useMutation({
    mutationFn: async ({ productId }: IGetCheckoutUrl) => {
      const result = await fetch(`/api/products/${productId}/checkout-url`, {
        method: "POST",
      });
      const response: IResponse<IGetCheckoutUrlResponse> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
  });
};
