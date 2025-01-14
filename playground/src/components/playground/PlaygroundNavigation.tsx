import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { CheckNft } from './CheckNft.tsx';
import { ethers } from 'ethers';
import { Test } from './Test.tsx';

export const PlaygroundNavigation = ({ metamaskSigner }: { metamaskSigner: ethers.Signer | null }) => {
  const [value, setValue] = useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Check Nft Streaming" value="0" />
            <Tab label="Hackathon test" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <CheckNft metamaskSigner={metamaskSigner} />
        </TabPanel>
        <TabPanel value="1">
          <Test />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
