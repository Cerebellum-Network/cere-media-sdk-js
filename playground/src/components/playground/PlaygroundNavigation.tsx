import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { VideoExample } from 'playground/src/components/video-example/VideoExample';
import { AudioExample } from '../audio-example';
import { NewTab } from './NewTab.tsx';

export const PlaygroundNavigation = () => {
  const [value, setValue] = useState('0');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Nfts" value="0" />
            <Tab label="Video Example" value="4" />
            <Tab label="Audio Example" value="5" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <NewTab />
        </TabPanel>
        <TabPanel value="4">
          <VideoExample />
        </TabPanel>
        <TabPanel value="5">
          <AudioExample />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
