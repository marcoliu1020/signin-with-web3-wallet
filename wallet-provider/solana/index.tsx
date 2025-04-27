'use client'

import { createContext, useContext, useEffect, useState } from 'react';

// utils
import { getProvider, signMessageWithSolana } from './utils';

// signin-pipe-work
import { AuthenticationAdapter, initAdapter, signInPipeWork } from '@/wallet-provider/signin-pipe-work';

// constants
import { CHAIN_ID } from '@/constants';

// types
import type { WalletAuthStatus, WalletContext } from '@/wallet-provider/types';

const SolanaContext = createContext<WalletContext | null>(null);

export function useSolanaWallet() {
    const context = useContext(SolanaContext);
    if (!context) {
        throw new Error('useSolanaWallet must be used within a SolanaContextProvider');
    }
    return context;
}

export function SolanaContextProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [authStatus, setAuthStatus] = useState<WalletAuthStatus>('unauthenticated');

    /**
     * Connect
     */
    const connect = async () => {
        const provider = getProvider();
        if (!provider) throw new Error('Solana provider not found');

        try {
            const response = await provider.connect();
            const publicKey = response.publicKey.toString();
            setAddress(publicKey);
            setIsConnected(true);
            return publicKey;
        } catch (error) {
            setAddress(null);
            setIsConnected(false);
            throw error;
        }
    };

    /**
     * Disconnect
     */
    const disconnect = () => {
        // There is no way to programmatically disconnect a user from their connection once they have established one.
        // https://docs.phantom.com/ethereum-monad-testnet-base-and-polygon/establishing-a-connection#disconnecting
        setAddress(null);
        setIsConnected(false);
        setAuthStatus('unauthenticated');
    };

    /**
     * Sign Message
     */
    const signMessage = async (message: string) => {
        const provider = getProvider();
        if (!provider) throw new Error('Solana provider not found');

        try {
            const signedMessage = await signMessageWithSolana(provider, message);
            return signedMessage;
        } catch (error) {
            console.error('Failed to sign message:', error);
            throw error;
        }
    };

    /**
     * Sign In Backend and get userToken
     */
    const signInBackend = async () => {
        if (authStatus === 'pending') throw new Error('Solana wallet: Pending');
        if (authStatus === 'authenticated') throw new Error('Solana wallet: Already authenticated');
        if (!address) throw new Error('Solana wallet: Address is not set');

        /** solana 錢包認證適配器 */
        const solanaAuthAdapter: AuthenticationAdapter = {
            ...initAdapter,
            createSignature: async ({ nonce }) => {
                const signature = await signMessage(nonce);
                return signature || "";
            }
        };

        try {
            setAuthStatus('pending');
            const signInFlow = signInPipeWork(address, CHAIN_ID.SOLANA);
            const result = await signInFlow(solanaAuthAdapter);
            if (result.error) throw new Error(result.error);
            setAuthStatus('authenticated');
            return true;
        } catch (error) {
            setAuthStatus('unauthenticated');
            throw error;
        }
    };

    useEffect(() => {
        const provider = getProvider();
        if (!provider) return;

        // Check if already connected
        if (provider.isConnected) {
            const publicKey = provider.publicKey?.toString();
            if (publicKey) {
                setAddress(publicKey);
                setIsConnected(true);
            }
        }

        // Listen for account changes
        provider.on('accountChanged', () => {
            disconnect();
        });

        return () => {
            // Cleanup function
            try {
                // @ts-expect-error - removeAllListeners might not exist in all versions
                provider.removeAllListeners?.();
            } catch (error) {
                console.warn('Failed to remove listeners:', error);
            }
        };
    }, []);

    return (
        <SolanaContext.Provider
            value={{
                authStatus,
                address,
                isConnected,
                connect,
                disconnect,
                signMessage,
                signInBackend
            }}
        >
            {children}
        </SolanaContext.Provider>
    );
}
