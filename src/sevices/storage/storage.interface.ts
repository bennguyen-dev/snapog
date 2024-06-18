export interface IUploadImage {
  image: Buffer;
  key: string; // `${folder}/${fileName}.${type.EXTENSION}`
}

export interface IDeleteImages {
  keys: string[];
}

export interface IDeleteFolders {
  prefixes: string[];
}

export interface IUploadImageResponse {
  src: string;
}
