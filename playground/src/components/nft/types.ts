type MultimediaContentType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/ogg'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo';

export type FreeportNftAsset = {
  name: string;
  description: string;
  preview: string;
  asset: string;
  contentType: MultimediaContentType;
};
