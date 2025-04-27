'use client'

// wagmi
import { WagmiProvider } from 'wagmi';
import { config } from "./config";

export function EthereumContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            {children}
        </WagmiProvider>
    )
}
