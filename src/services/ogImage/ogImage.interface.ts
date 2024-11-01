export interface ICreateOGImage {
  src: string;
  expiresAt: Date;
  userId: string;
}

export interface IUpdateOGImage {
  id: string;
  src: string;
  expiresAt: Date;
}

export interface IOGImageDetail {
  id: string;
  src: string;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
