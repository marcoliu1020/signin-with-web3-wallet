'use client'

import { createContext, useContext, useEffect, useState } from 'react';

// signin-pipe-work
import { AuthenticationAdapter, initAdapter, signInPipeWork } from '@/wallet-provider/signin-pipe-work';

// constants
import { CHAIN_ID } from '@/constants';

// types
import type { WalletAuthStatus, WalletContext } from '@/wallet-provider/types';

const TronContext = createContext<WalletContext | null>(null);

export function useTronWallet() {
    const context = useContext(TronContext);
    if (!context) {
        throw new Error('useTronWallet must be used within a TronContextProvider');
    }
    return context;
}

export function TronContextProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [authStatus, setAuthStatus] = useState<WalletAuthStatus>('unauthenticated');

    /**
     * Connect
     */
    const connect = async () => {
        try {
            if (!window.tronWeb) {
                throw new Error('TronLink not installed');
            }

            const res = await window.tronWeb.request({ method: 'tron_requestAccounts' });

            if (res.code === 200) {
                const address = window.tronWeb.defaultAddress.base58;
                setAddress(address);
                setIsConnected(true);
                return address;
            } else {
                throw new Error('Failed to connect to TronLink');
            }
        } catch (error) {
            console.error('Failed to connect to TronLink:', error);
            throw error;
        }
    };

    /**
     * Disconnect
     */
    const disconnect = () => {
        // TODO: 沒有找到實際斷開的 API
        setAddress(null);
        setIsConnected(false);
        setAuthStatus('unauthenticated');
    };

    /**
     * Sign Message
     */
    const signMessage = async (message: string) => {
        if (!window.tronWeb || !address) {
            throw new Error('Wallet not connected');
        }

        try {
            const signedMessage = await window.tronWeb.trx.signMessageV2(message);
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
        if (authStatus === 'pending') throw new Error('Tron wallet: Pending')
        if (authStatus === 'authenticated') throw new Error('Tron wallet: Already authenticated')
        if (!address) throw new Error('Tron wallet: Address is not set')

        /** tron 錢包認證適配器 */
        const tronAuthAdapter: AuthenticationAdapter = {
            ...initAdapter,
            createSignature: async ({ nonce }) => {
                const signature = await signMessage(nonce);
                return signature || "";
            }
        }

        try {
            setAuthStatus('pending');
            const signInFlow = signInPipeWork(address, CHAIN_ID.TRON)
            const result = await signInFlow(tronAuthAdapter)
            if (result.error) throw new Error(result.error)
            setAuthStatus('authenticated');
            return true
        } catch (error) {
            setAuthStatus('unauthenticated');
            throw error;
        }
    }

    useEffect(() => {
        // Check if already connected
        if (window.tronWeb && window.tronWeb.ready) {
          setAddress(window.tronWeb.defaultAddress.base58);
          setIsConnected(true);
        }

        // Listen for account changes
        window.addEventListener('message', handleAccountChange);
        return () => window.removeEventListener('message', handleAccountChange);

        function handleAccountChange(event: MessageEvent) {
            if (event.data.message && event.data.message.action === 'accountsChanged') {
                // 換錢包需要重新登入
                disconnect();
            }
        };
    }, []);

    return (
        <TronContext.Provider
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
        </TronContext.Provider>
    );
}