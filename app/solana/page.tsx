'use client'

import { SolanaConnectButton } from '@/wallet-provider/solana/components/solana-connect-button'

export default function SolanaPage() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-6">Solana Wallet Connection</h1>
            <SolanaConnectButton />
        </div>

    )
}