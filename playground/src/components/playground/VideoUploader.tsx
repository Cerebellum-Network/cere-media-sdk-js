import 'react-h5-audio-player/lib/styles.css';
import '../../../../packages/react/src/components/video/styles.css';

import {FFmpeg} from '@ffmpeg/ffmpeg';
import {toBlobURL, fetchFile} from '@ffmpeg/util';
import {useEffect, useRef, useState} from 'react';
import {useWallet} from "../../cere-wallet";
import {DdcClient, File as DdcFile, CereWalletSigner, TESTNET} from '@cere-ddc-sdk/ddc-client';
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Alert, AlertTitle,
    Button, Checkbox,
    FormControlLabel,
    Stack,
    Step, StepContent,
    StepLabel,
    Stepper,
    TextField
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {styled} from '@mui/material/styles';
import * as crypto from 'crypto-js';

export interface VideoConverterProps {
    anything: string;
}


export const VideoUploader = () => {
    const [keepUnencrypted, setKeepUnencrypted] = useState(false);
    const [dek, setDek] = useState('');
    const [uploadedVideoCid, setUploadedVideoCid] = useState('');
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [encodingStarted, setEncodingStarted] = useState(false);
    const [encodingFinished, setEncodingFinished] = useState(false);
    const [chosenFileName, setChosenFileName] = useState('');
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    const [file, setFile] = useState<File | undefined>();
    const [progressBar, setProgress] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStarted, setUploadStarted] = useState(false);
    const [uploadFinished, setUploadFinished] = useState(false);
    const [bucketId, setBucketId] = useState<bigint | undefined>();
    const wallet = useWallet();
    const [ddcClient, setDdcClient] = useState<DdcClient>();
    const [step, setStep] = useState(0);

    useEffect(() => {
        const initialiseDdcClient = async () => {
            const signer = new CereWalletSigner(wallet, {autoConnect: false})
            const client = await DdcClient.create(signer, TESTNET);
            setDdcClient(client)
        }

        initialiseDdcClient()
    }, []);

    function encrypt(data: string, secretKey: string): string {
        return crypto.AES.encrypt(data, secretKey).toString();
    }
    const load = async () => {
        const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({message}) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                "application/wasm"
            ),
            workerURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.worker.js`,
                "text/javascript"
            ),
        });
        setStep(1);
        setFfmpegLoaded(true);
    };

    const transcode = async () => {
        setEncodingStarted(true);
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('progress', ({progress, time}) => {
            setProgress(progress * 100);
        });

        await ffmpeg.writeFile('input.avi', await fetchFile(file));
        await ffmpeg.exec(['-i', 'input.avi', '-hls_time', '6', '-hls_list_size', '0', '-f', 'hls', 'output.m3u8']);
        setEncodingFinished(true)
        setStep(3)
    };

    const upload = async () => {
        if (bucketId == undefined) {
            return
        }

        const ffmpeg = ffmpegRef.current;
        const fsNodes = await ffmpeg.listDir('/')

        const totalFiles = fsNodes.filter((v) => v.name.includes('output')).length
        let uploadedFiles = 0

        setUploadProgress(0)
        setUploadStarted(true)

        const m3u8DataByteArray: any = await ffmpeg.readFile('output.m3u8');
        let m3u8Data = Buffer.from(m3u8DataByteArray).toString('utf-8')

        console.log(m3u8Data)
        console.log('--------')
        console.log(await ffmpeg.readFile('output.m3u8'))
        console.log('--------')
     /*   console.log(await ffmpeg.listDir(''));
        console.log(await ffmpeg.listDir('/'));
        console.log(await ffmpeg.listDir('./'));*/
        // Upload TS files by assuming a known naming pattern
        let segmentIndex = 0;
        let segmentExists = true;
//nacl.secretbox.open(encrypted, nonce, secretKey) || null;
        while (segmentExists) {
            try {
                const segmentName = `output${segmentIndex}.ts`;
                let tsData: any = await ffmpeg.readFile(segmentName);

                if (!keepUnencrypted) {
                    console.log('encrypting segment ' + segmentName)
console.log(tsData)
                    const d = Buffer.from(tsData).toString('utf-8')
                    const e = encrypt(d, dek)
                    console.log('upload encrypted segment')
                    console.log(d)
                    console.log('ENCRPYTED')
                    console.log(e)
                    tsData = new TextEncoder().encode(e);
                }

                const uri = await ddcClient.store(bucketId, new DdcFile(tsData, {size: tsData.size}));
                console.log('Uploaded TS (segment: ' + segmentName + ' CID: ' + uri.cid + ')');
                m3u8Data = m3u8Data.replace(segmentName, uri.cid)

                segmentIndex++;
                uploadedFiles++
                setUploadProgress(uploadedFiles * 100/totalFiles)
            } catch (error) {
                console.log(error)
                console.log('M3U8')
                console.log(m3u8Data)
                if (!keepUnencrypted) {
                    console.log('encrypting m3u8')
                    m3u8Data = encrypt(m3u8Data, dek)
                    console.log(m3u8Data)
                }
                const encodedM3u8 = new TextEncoder().encode(m3u8Data)
                console.log(encodedM3u8)
                const uri = await ddcClient.store(bucketId, new DdcFile(encodedM3u8, {size: m3u8Data.length}))
                console.log('Uploaded m3u8 (CID: ' + uri.cid + ')');
                segmentExists = false
                setUploadedVideoCid(uri.cid)
                uploadedFiles++
                setUploadProgress(uploadedFiles * 100/totalFiles)
            }
        }

        setStep(5)
        setUploadFinished(true)
    }

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        setFile(file);
        setStep(2)
        setChosenFileName(file.name)
    };

    return <Box sx={{width: 500}}><Stepper orientation="vertical" activeStep={step}>
        <Step>
            <Stack>
                {ffmpegLoaded ?
                    <div><StepLabel>The ffmpeg WebAssembly package has been loaded successfully</StepLabel></div> :
                    <div>
                        <StepLabel>Please, load ffmpeg WASM package to encode the video</StepLabel>
                        <div width="100px">
                            <Button variant="contained" onClick={load}>
                                Load ffmpeg package
                            </Button>
                        </div>
                    </div>
                }
            </Stack>
        </Step>
        <Step completed={chosenFileName != ''}>
            {chosenFileName != '' ?
                <StepLabel>Selected file: {chosenFileName}</StepLabel>
                :
                <StepLabel>Please, select a file you would like to upload</StepLabel>
            }
            {step == 1 ?
                <div
                     style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon/>}
                    >
                        Choose file
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                </div>
                : <div/>}
        </Step>

        <Step completed={encodingFinished}>
            <StepLabel>Encode video to HLS</StepLabel>
            {step == 2 && !encodingStarted ? <Button variant="contained" onClick={transcode}>Convert</Button> :
                <div></div>}
            {encodingStarted && !encodingFinished ? <div>
            <CircularProgressWithLabel value={progressBar}/>
            <p ref={messageRef}></p>
        </div> : <div></div>}

        </Step>


        <Step completed={step > 3}>
            <StepLabel>Encrypt video {step > 3 && keepUnencrypted? '(disabled)' : ''}</StepLabel>
            <StepContent>
            <Stack spacing={2} direction="row" paddingTop={1} alignItems="start">
            <TextField
                label="Data encryption key"
                size="small"
                disabled={keepUnencrypted}
                value={keepUnencrypted ? '' : dek?.toString() || ''}
                onChange={(event) => setDek(event.target.value)}
            />

            <FormControlLabel
                label="No encryption"
                sx={{ whiteSpace: 'nowrap' }}
                control={
                    <Checkbox checked={keepUnencrypted} onChange={(event) => setKeepUnencrypted(event.target.checked)} />
                }
            />
            </Stack>
            <Stack direction="row" paddingTop={1} spacing={1}>
            <Button variant="contained" onClick={() => setStep(4)}>Continue</Button>
            </Stack>
            </StepContent>
          {/*  {step == 2 && !encodingStarted ? <Button variant="contained" onClick={transcode}>Convert</Button> :
                <div></div>}
            {encodingStarted && !encodingFinished ? <div>
                <CircularProgressWithLabel value={progressBar}/>
                <p ref={messageRef}></p>
            </div> : <div></div>}*/}

        </Step>

        <Step completed={step>4}>
            <StepLabel>Upload HLS encoded video to DDC</StepLabel>
            <StepContent>
            {step == 4 && !uploadStarted ? <Stack spacing={2} paddingTop={1} alignItems="start">
                <TextField
                    label="Bucket ID"
                    size="small"
                    type="number"
                    value={bucketId?.toString() || ''}
                    onChange={(event) => setBucketId(event.target.value ? BigInt(event.target.value) : undefined)}
                />
                <Button variant="contained" disabled={bucketId == undefined} onClick={upload}>Upload</Button>
            </Stack>: <div></div>}
                {step == 4 && uploadStarted && !uploadFinished ? <CircularProgressWithLabel value={uploadProgress}/>:<></>}
            </StepContent>
        </Step>



    </Stepper>
        {uploadFinished?
            <Alert severity="success" >
                <AlertTitle>Your video has been successfully uploaded to DDC!</AlertTitle>
                <p align="left">Bucket ID: {bucketId?.toString()}</p>
                <p align="left">HLS Manifest CID: {uploadedVideoCid}</p>
                {keepUnencrypted?<p align="left">Encrypted: No</p>:<div>
                    <p align="left">Encrypted: Yes</p>
                    <p align="left">Data encryption key: {dek}</p>
                </div>}
            </Alert>
            : <></>
        }
    </Box>

};

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary'}}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

