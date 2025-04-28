'use client'

import { useTronWallet } from '../index'

export function TronConnectButton() {
    const {
        authStatus,
        address,
        isConnected,
        connect,
        disconnect,
        signInBackend
    } = useTronWallet()

    const handleWalletConnect = async () => {
        try {
            await connect()
        } catch (error) {
            console.error('Failed to connect to TronLink:', error)
        }
    }

    const handleSignInBackend = async () => {
        try {
            const result = await signInBackend()
            if (result) {
                alert('Sign in to backend successfully ✅')
            } else {
                alert('Sign in to backend failed ❌')
            }
        } catch (error) {
            console.error('Failed to sign in to backend:', error)
        }
    }

    if (!isConnected) {
        return (
            <div className="flex flex-col gap-2">
                <button
                    onClick={handleWalletConnect}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Connect Tron Wallet
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Connected Address:</p>
                    <p className="font-mono text-sm break-all text-neutral-500">{address}</p>
                </div>
                <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Disconnect
                </button>
                {authStatus === 'unauthenticated' && <button
                    onClick={handleSignInBackend}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    Sign In Backend
                </button>}
            </div>
        </div>
    )
} 