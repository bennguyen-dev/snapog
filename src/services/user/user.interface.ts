import { User } from "@prisma/client";

export interface IGetUser {
  userId?: string;
  apiKey?: string;
  email?: string;
}

export interface IRegenerateApiKey {
  userId: string;
}

export interface IRegenerateApiKeyResponse {
  apiKey: string;
}

export interface IUser extends User {}
