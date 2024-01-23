import { useContext } from 'react';
import { MediaSdkClientContext } from '../providers';

/**
 * Fetch the details of the current Media Client instance from the Context Provider
 * @returns The current Media Client instance
 */
export const useMediaClient = () => {
  return useContext(MediaSdkClientContext);
};
