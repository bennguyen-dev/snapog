export interface IVerifyCaptcha {
  gReCaptchaToken: string;
}

export interface IVerifyCaptchaResponse {
  success: boolean;
  score: number;
}
