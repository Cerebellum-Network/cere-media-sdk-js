import { useContext } from 'react';
import { MediaSdkClientContext } from '../providers';

export const useMediaClient = () => {
  return useContext(MediaSdkClientContext);
};
