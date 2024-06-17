import { Box, Button, CircularProgress, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelectTenant } from '../select-tenant';
import {
  ChainNamespace,
  Deployment,
  FreeportNftAsset,
  mediaClientConfig,
  NftMetadata,
  Tenant,
} from '@cere/media-sdk-client';
import { NftPreview } from '../nft';
import { Signer } from 'ethers';
import { MediaSdkClientProvider } from '@cere/media-sdk-react';
import { useWallet } from '../../cere-wallet';
import { getWalletAccountType } from '../../cere-wallet/helper.ts';

const fetchNftMetadata = async (url: string, tenant: Tenant, deployment: Deployment) => {
  const response = await axios.create({ baseURL: mediaClientConfig[deployment][tenant].freeportApiUrl }).get(url);
  return response.data;
};

export const CheckNft = () => {
  const opts = useSelectTenant();
  console.log(opts);
  const [step, setStep] = useState(0);
  const [contractAddress, setContractAddress] = useState<string>();
  const [tokenId, setTokenId] = useState<number>();
  const [metadata, setMetadata] = useState<NftMetadata>();
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const isReadyForFetchMetadata = useMemo(() => !!contractAddress && !!tokenId, [contractAddress, tokenId]);

  const handleFetchMetadata = useCallback(async () => {
    setIsLoadingMetadata(true);
    try {
      const data = await fetchNftMetadata(
        `/api/content/metadata/${contractAddress}/${tokenId}`,
        opts.tenant,
        opts.deployment,
      );
      setMetadata(data);
      setStep(2);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [contractAddress, opts.deployment, opts.tenant, tokenId]);

  const wallet = useWallet();

  return (
    <Stepper orientation="vertical" activeStep={step}>
      <Step completed={isReadyForFetchMetadata}>
        <StepLabel>Fill in the required fields of the form</StepLabel>
        <Stack spacing={2} alignItems="start">
          <TextField
            value={contractAddress}
            label="tokenContract"
            onChange={(event) => setContractAddress(event.target.value)}
          />
          <TextField
            type="number"
            value={tokenId}
            label="tokenId"
            onChange={(event) => setTokenId(+event.target.value)}
          />
        </Stack>
      </Step>
      <Step completed={!!metadata}>
        <StepLabel>Load metadata</StepLabel>
        <Button variant="contained" disabled={!isReadyForFetchMetadata} onClick={handleFetchMetadata}>
          Load metadata
        </Button>
        <Stack spacing={2} alignItems="start">
          {isLoadingMetadata && <CircularProgress />}
          {metadata && (
            <Box
              textAlign="justify"
              maxWidth={700}
              overflow="scroll"
              sx={{
                padding: '10px',
                backgroundColor: '#f4f4f4',
                borderRadius: '5px',
                marginTop: '10px !important',
              }}
            >
              <pre>{JSON.stringify(metadata, null, 2)}</pre>
            </Box>
          )}
        </Stack>
      </Step>
      <Step>
        <StepLabel>View Nft Content</StepLabel>
        <Box>
          {metadata?.assets.map((asset, idx) => {
            const signer = wallet.getSigner({ type: getWalletAccountType(ChainNamespace.EIP155) });
            return (
              <MediaSdkClientProvider
                key={`${contractAddress}::${tokenId}`}
                chainId="80002"
                chainNamespace={ChainNamespace.EIP155}
                signer={signer as unknown as Signer}
              >
                <NftPreview
                  assetIndex={idx}
                  title={asset?.name}
                  description={asset?.description}
                  asset={asset as FreeportNftAsset}
                  nftId={tokenId!}
                  collectionAddress={contractAddress!}
                />
              </MediaSdkClientProvider>
            );
          })}
        </Box>
      </Step>
    </Stepper>
  );
};
