import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { CollectionsTab } from './CollectionsTab';

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
            <Tab label="Collections" value="1" />
            <Tab label="NFTs" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <CollectionsTab />
        </TabPanel>
        <TabPanel value="2">Tokens</TabPanel>
      </TabContext>
    </Box>
  );
};
