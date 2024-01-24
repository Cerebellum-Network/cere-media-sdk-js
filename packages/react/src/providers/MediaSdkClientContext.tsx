import React from 'react';

import { UseMediaClientReturn } from '../types';

export interface MediaSdkClientContext extends UseMediaClientReturn {}

export const MediaSdkClientContext = React.createContext<MediaSdkClientContext>({
  client: undefined,
  error: undefined,
  isLoading: false,
});
