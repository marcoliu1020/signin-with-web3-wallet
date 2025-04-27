'use client'

import { TronConnectButton } from '@/wallet-provider/tron/connect-button'

export default function TronPage() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-6">Tron Wallet Connection</h1>
            <TronConnectButton />
        </div>

    )
}