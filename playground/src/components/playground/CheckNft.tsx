import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material';
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

export const ChainIds: { [key in ChainNamespace]: { id: string; name: string }[] } = {
  [ChainNamespace.EIP155]: [{ id: '80002', name: 'Polygon Devnet' }],
  [ChainNamespace.SOLANA]: [
    { id: '1', name: 'Solana Mainnet' },
    { id: '2', name: 'Solana Testnet' },
    { id: '3', name: 'Solana Devnet' },
  ],
};

const fetchNftMetadata = async (
  url: string,
  tenant: Tenant,
  deployment: Deployment,
  chainNamespace: ChainNamespace,
  chainId: string,
) => {
  const response = await axios
    .create({
      baseURL: mediaClientConfig[deployment][tenant].freeportApiUrl,
      headers: {
        'chain-namespace': chainNamespace,
        'chain-id': chainId,
      },
    })
    .get(url);
  return response.data;
};

export const CheckNft = () => {
  const opts = useSelectTenant();
  const [step, setStep] = useState(0);
  const [selectedChainNamespace, setSelectedChainNamespace] = useState<ChainNamespace>(ChainNamespace.SOLANA);
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>();
  const [tokenId, setTokenId] = useState<number>();
  const [metadata, setMetadata] = useState<NftMetadata>();
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const isReadyForFetchMetadata = useMemo(
    () => contractAddress !== undefined && contractAddress !== null && tokenId !== undefined && tokenId !== null,
    [contractAddress, tokenId],
  );

  const handleFetchMetadata = useCallback(async () => {
    setIsLoadingMetadata(true);
    try {
      const data = await fetchNftMetadata(
        `/api/content/metadata/${contractAddress}/${tokenId}`,
        opts.tenant,
        opts.deployment,
        selectedChainNamespace,
        selectedChainId,
      );
      setMetadata(data);
      setStep(2);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [contractAddress, opts.deployment, opts.tenant, selectedChainId, selectedChainNamespace, tokenId]);

  const wallet = useWallet();

  return (
    <Stepper orientation="vertical" activeStep={step}>
      <Step>
        <Stack maxWidth="200px">
          <StepLabel>Choose network</StepLabel>
          <FormControl variant="outlined">
            <InputLabel id="chain-select-label">Chain</InputLabel>
            <Select
              labelId="chain-select-label"
              id="chain-select"
              value={selectedChainNamespace}
              onChange={(event) => {
                setSelectedChainNamespace(event.target.value as ChainNamespace);
                setSelectedChainId('');
                setStep(0);
              }}
              label="Chain"
            >
              {Object.values(ChainNamespace).map((chain) => (
                <MenuItem key={chain} value={chain}>
                  {chain.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedChainNamespace && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="chainid-select-label">Chain ID</InputLabel>
              <Select
                labelId="chainid-select-label"
                id="chainid-select"
                value={selectedChainId}
                onChange={(event) => setSelectedChainId(event.target.value)}
                label="Chain ID"
              >
                {ChainIds[selectedChainNamespace].map((chain) => (
                  <MenuItem key={chain.id} value={chain.id}>
                    {chain.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </Step>
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
      <Step completed={!!metadata}>
        <StepLabel>View Nft Content</StepLabel>
        <Box>
          {metadata?.assets.map((asset, idx) => {
            const signer = wallet.getSigner({ type: getWalletAccountType(selectedChainNamespace) });
            return (
              <MediaSdkClientProvider
                key={`${contractAddress}::${tokenId}`}
                chainId={selectedChainId}
                chainNamespace={selectedChainNamespace}
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
