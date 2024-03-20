import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { CollectionsTab } from './CollectionsTab';
import { OwnedNftsTab } from './OwnedNftsTab';
import { MintedNftsTab } from './MintedNftsTab';
import { VideoExample } from 'playground/src/components/video-example/VideoExample';
import { AudioExample } from '../audio-example';
import { ErrorReproduce } from './ErrorReproduce.tsx';

export const PlaygroundNavigation = () => {
  const [value, setValue] = useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Error reproduce" value="1" />
            <Tab label="Collections" value="2" />
            <Tab label="Owned Nfts" value="3" />
            <Tab label="Minted Nfts" value="4" />
            <Tab label="Video Example" value="5" />
            <Tab label="Audio Example" value="6" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ErrorReproduce />
        </TabPanel>
        <TabPanel value="2">
          <CollectionsTab />
        </TabPanel>
        <TabPanel value="3">
          <OwnedNftsTab />
        </TabPanel>
        <TabPanel value="4">
          <MintedNftsTab />
        </TabPanel>
        <TabPanel value="5">
          <VideoExample />
        </TabPanel>
        <TabPanel value="6">
          <AudioExample />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
