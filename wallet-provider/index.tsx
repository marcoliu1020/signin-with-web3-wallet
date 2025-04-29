'use client'

// ethereum
import { EthereumContextProvider } from "./ethereum";
// solana
import { SolanaContextProvider } from "./solana";
// tron
import { TronContextProvider } from "./tron";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <TronContextProvider>
      <EthereumContextProvider>
        <SolanaContextProvider>
          {children}
        </SolanaContextProvider>
      </EthereumContextProvider>
    </TronContextProvider>
  )
}
