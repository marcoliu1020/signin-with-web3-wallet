'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from 'react';
import { WagmiProvider, useAccount, useDisconnect, useSignMessage } from 'wagmi';
// import { watchAccount } from '@wagmi/core'
import { config } from "./config";

// signin-pipe-work
import { AuthenticationAdapter, initAdapter, signInPipeWork } from '@/wallet-provider/signin-pipe-work';

// constants
import { CHAIN_ID } from '@/constants';

// types
import type { WalletAuthStatus, WalletContext } from '@/wallet-provider/types';

const EthereumContext = createContext<WalletContext | null>(null);

export function useEthereumWallet() {
    const context = useContext(EthereumContext);
    if (!context) {
        throw new Error('useEthereumWallet must be used within a EthereumContextProvider');
    }
    return context;
}

function EthereumProvider({ children }: { children: React.ReactNode }) {
    const { address = "", isConnected } = useAccount();
    const { disconnect: disconnectWagmi } = useDisconnect();
    const { signMessageAsync } = useSignMessage();
    const [authStatus, setAuthStatus] = useState<WalletAuthStatus>('unauthenticated');

    /**
     * Connect
     */
    const connect = async () => {
        // ⚠️⚠️⚠️
        // DO NOT IMPLEMENT THIS FUNCTION

        // 請使用 import { Connector, useConnect } from 'wagmi'
        // const { connectors } = useConnect()
        // const metaMaskConnector = connectors.find(connector => connector.type === 'metaMask')
        // <button
        //     disabled={!ready}
        //     onClick={() => connect({ connector })}
        //     className='border border-gray-300 rounded-md p-2'
        // >
        //     MetaMask connect
        // </button>
        return address || "";
    }

    /**
     * Disconnect
     */
    const disconnect = () => {
        disconnectWagmi()
    };

    /**
     * Sign Message
     */
    const signMessage = async (message: string) => {
        try {
            const signature = await signMessageAsync({ message });
            return signature;
        } catch (error) {
            console.error('Failed to sign message:', error);
            throw error;
        }
    };

    /**
     * Sign In Backend and get userToken
     */
    const signInBackend = async (currentAddress: string) => {
        if (authStatus === 'pending') throw new Error('Ethereum wallet: Pending');
        if (authStatus === 'authenticated') throw new Error('Ethereum wallet: Already authenticated');
        if (!currentAddress) throw new Error('Ethereum wallet: Address is not set');

        /** ethereum 錢包認證適配器 */
        const ethereumAuthAdapter: AuthenticationAdapter = {
            ...initAdapter,
            createSignature: async ({ nonce }) => {
                const signature = await signMessage(nonce);
                return signature || "";
            }
        };

        try {
            setAuthStatus('pending');
            const signInFlow = signInPipeWork(currentAddress, CHAIN_ID.ETHEREUM);
            const result = await signInFlow(ethereumAuthAdapter);
            if (result.error) throw new Error(result.error);
            setAuthStatus('authenticated');
            return true;
        } catch (error) {
            setAuthStatus('unauthenticated');
            throw error;
        }
    };

    useEffect(() => {
        // TODO:update authStatus when user has sign in backend
        // ...

        // const unwatch = watchAccount(config, {
        //     onChange(account) { 
        //         // WARNING: wagmi 錢包切換帳號沒有反應，只有斷開連線 accountChanged 才會觸發
        //         console.log('Account changed!', account)
        //     },
        // })
        // return () => unwatch()
    }, [])

    return (
        <EthereumContext.Provider
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
        </EthereumContext.Provider>
    );
}

const queryClient = new QueryClient()

export function EthereumContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <EthereumProvider>
                    {children}
                </EthereumProvider>
            </WagmiProvider>
        </QueryClientProvider>
    )
}
