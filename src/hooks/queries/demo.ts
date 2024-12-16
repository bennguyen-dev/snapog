import { useMutation } from "@tanstack/react-query";

import { ICreateDemo, ICreateDemoResponse } from "@/services/demo";
import { IVerifyCaptcha } from "@/services/googleCaptcha";
import { IResponse } from "@/types/global";

export const useCreateDemo = () => {
  return useMutation({
    mutationFn: async ({
      url,
      numberOfImages = 3,
      gReCaptchaToken,
    }: ICreateDemo & IVerifyCaptcha) => {
      const result = await fetch(`/api/demo`, {
        method: "POST",
        body: JSON.stringify({ url, numberOfImages, gReCaptchaToken }),
      });
      const response: IResponse<ICreateDemoResponse> = await result.json();
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.message);
    },
  });
};
