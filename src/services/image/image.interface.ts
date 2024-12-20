export interface IGenerateOGImage {
  url: string;
  apiKey: string;
}

export interface IGenerateOGImageResponse {
  image: Buffer;
  contentType: string;
}

export interface IGetImageByImageLink {
  imageLink: string;
}

export interface IGetImageByImageLinkResponse {
  image: Buffer;
  contentType: string;
  size: number;
}

// add frame
interface Shadow {
  x: number;
  y: number;
  blur: number;
  color: string;
}

interface Position {
  top: number;
  left: number;
}

interface TextConfig {
  content: string;
  fontSize: number;
  color: string;
  position: Position;
}

interface ImagePlaceholder {
  width: number;
  height: number;
  position: Position;
  borderRadius: number;
  shadow: Shadow;
}

export interface TemplateConfig {
  id: string; // định danh template
  name: string; // tên template để hiển thị
  frame: {
    width: number;
    height: number;
    backgroundImage: string; // path tới background image của template
    borderRadius: number;
    shadow: Shadow;
  };
  imagePlaceholder: ImagePlaceholder; // vị trí và style cho ảnh sẽ được chèn vào
  text: {
    title: Omit<TextConfig, "content">; // bỏ content vì content sẽ được điền sau
    description: Omit<TextConfig, "content">;
  };
}

// Input từ người dùng
export interface AddFrameImage {
  config: TemplateConfig;
  image: Buffer;
  text?: {
    title?: string;
    description?: string;
  };
}
