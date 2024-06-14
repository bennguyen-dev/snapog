export interface ICreateOGImage {
  src: string;
  expiresAt: Date;
}

export interface IUpdateOGImage {
  id: string;
  src: string;
  expiresAt: Date;
}

export interface IOGImageDetail {
  id: string;
  src: string;

  createdAt: Date;
  updatedAt: Date;
}
