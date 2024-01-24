import { NFT, NftMetadata } from '@cere-media-sdk/client';

import { useEncryptedContent } from '../../hooks';

export interface ContentViewProps {
  nft: NFT;
  metadata: NftMetadata;
  assetIndex: number;
}

export const ContentView = ({ nft, metadata, assetIndex }: ContentViewProps) => {
  const { content, isLoading, isVideo, contentType, asset } = useEncryptedContent(nft, metadata, assetIndex);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (['image/png', 'image/jpeg', 'image/gif'].includes(contentType)) {
    return <>{content && <img alt={asset?.name} src={content} width="100%" height="100%" />}</>;
  }

  if (['audio/mp4', 'audio/mpeg', 'audio/x-wav', 'audio/ogg'].includes(contentType)) {
    return (
      <audio title={asset?.name} controls autoPlay>
        <source src={content} />
      </audio>
    );
  }

  if (isVideo) {
    return <>Video not supported yet</>;
  }

  console.error(`Unhandled media type ${contentType}`);
  return <>Unhandled media type {contentType}</>;
};
