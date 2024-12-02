import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import {EmbedWallet} from '@cere/embed-wallet'; // Cere wallet SDK package
import {DdcClient, CereWalletSigner, TESTNET} from '@cere-ddc-sdk/ddc-client';
import {useWallet} from "../cere-wallet";

const DdcClientContext = createContext<DdcClient | null>(null);

export const useDdcClient = () => {
    const ddcClient = useContext(DdcClientContext);

    if (!ddcClient) {
        throw new Error('Not in ddc client context');
    }

    return ddcClient;
};

export const DdcClientProvider = ({children}: PropsWithChildren<NonNullable<unknown>>) => {
    const wallet = useWallet();
    const ddcClient = useMemo(
        () => {
            const signer = new CereWalletSigner(wallet, {autoConnect: false});
            return new DdcClient(signer, TESTNET);
        },
        [],
    );

    return <DdcClientContext.Provider value={ddcClient}>{children}</DdcClientContext.Provider>;
};
