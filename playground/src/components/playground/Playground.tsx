import {Box, Button, Checkbox, FormControlLabel, Stack, Tabs, TextField} from '@mui/material';
import {SelectTenant} from '../select-tenant';
import {useState} from 'react';
import {CheckNft} from './CheckNft.tsx';
import {VideoUploader} from './VideoUploader.tsx';
import {ethers} from 'ethers';
import CircularProgress from "@mui/material/CircularProgress";
import {EncryptedVideoPlayer} from "@cere/media-sdk-react";
import TabContext from '@mui/lab/TabContext';
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AirplayIcon from '@mui/icons-material/Airplay';

export const Playground = ({
                               disconnect,
                               metaMaskAccount,
                               metamaskSigner,
                           }: {
    disconnect: () => void;
    metaMaskAccount?: string;
    metamaskSigner: ethers.Signer | null;
}) => {
    const [value, setValue] = useState('0');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const [videoPlayerEnabled, setVideoPlayerEnabled] = useState(false);
    const [noEncryption, setNoEncryption] = useState(false);
    const [bucketId, setBucketId] = useState<bigint | undefined>();
    const [cid, setCid] = useState('');
    const [dek, setDek] = useState('');

    return (
        <>
            <div style={{justifyContent: 'center'}}>
                <TabContext value={value}>

                    <Tabs onChange={handleChange} aria-label="lab API tabs example" centered>
                        <Tab icon={<CloudUploadIcon/>} label="Uploader" value="1"/>
                        <Tab icon={<AirplayIcon/>} label="Player" value="2"/>
                    </Tabs>
                    <TabPanel value="1">
                        <VideoUploader/>
                    </TabPanel>
                    <TabPanel value="2">
                        <Stack spacing={2} direction="column">
                            <TextField
                                label="Bucket ID"
                                size="small"
                                type="number"
                                value={bucketId?.toString() || ''}
                                onChange={(event) => setBucketId(event.target.value ? BigInt(event.target.value) : undefined)}
                            />
                            <TextField
                                label="HLS Manifest CID"
                                size="small"
                                value={cid}
                                onChange={(event) => setCid(event.target.value)}
                            />
                            <Stack spacing={2} direction="row" paddingTop={1} paddingBottom={1} alignItems="start">

                                <TextField
                                    label="Data encryption key"
                                    size="small"
                                    disabled={noEncryption}
                                    value={noEncryption ? '' : dek?.toString() || ''}
                                    onChange={(event) => setDek(event.target.value)}
                                />

                                <FormControlLabel
                                    label="No encryption"
                                    sx={{ whiteSpace: 'nowrap' }}
                                    control={
                                        <Checkbox checked={noEncryption} onChange={(event) => setNoEncryption(event.target.checked)} />
                                    }
                                />
                            </Stack>
                        </Stack>
                        <Button variant="contained" disabled={bucketId == undefined || cid == '' || (!noEncryption && dek == '')} onClick={() => setVideoPlayerEnabled(true)}>Play video</Button>
                        {videoPlayerEnabled && !!bucketId?
                            <Box paddingTop={1}>
                        <EncryptedVideoPlayer
                            bucketId={bucketId}
                            cid={cid}
                            dek={noEncryption ? '' : dek}
                            loadingComponent={<CircularProgress/>}
                        /></Box>:<></>
                        }
                    </TabPanel>
                </TabContext>
            </div>
        </>
    );
};
