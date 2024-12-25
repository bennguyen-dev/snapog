import {
  IVerifyCaptcha,
  IVerifyCaptchaResponse,
} from "@/services/googleCaptcha/googleCaptcha.interface";
import { IResponse } from "@/types/global";

class GoogleCaptchaService {
  async verifyCaptcha({
    gReCaptchaToken,
  }: IVerifyCaptcha): Promise<IResponse<IVerifyCaptchaResponse | null>> {
    const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

    try {
      const res = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          cache: "no-cache",
          body: `secret=${secretKey}&response=${gReCaptchaToken}`,
        },
      );

      const json = await res.json();

      if (json && json.success && json.score > 0.5) {
        return {
          status: 200,
          message: "Google Captcha Verified Successfully",
          data: {
            success: true,
            score: json.score,
          },
        };
      } else {
        return {
          status: 400,
          message: "Google Captcha Verification Failed",
          data: null,
        };
      }
    } catch (error) {
      console.error(`Error verifying Google Captcha: ${error}`);
      return {
        status: 500,
        message: "Error verifying Google Captcha. Please try again later.",
        data: null,
      };
    }
  }
}

export const googleCaptchaService = new GoogleCaptchaService();
