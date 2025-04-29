'use client'

import { useTronWallet } from '../index'

export function TronConnectButton() {
    const {
        connect,
        signInBackend
    } = useTronWallet()

    const handleConnectAndSignIn = async () => {
        const address = await connect()

        if (!address) {
            alert('Please connect your wallet first')
            return
        }

        const result = await signInBackend(address)
        if (result) {
            alert('Sign in to backend successfully ✅')
        } else {
            alert('Sign in to backend failed ❌')
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleConnectAndSignIn}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
                connect and sign in
            </button>
        </div>
    )
} 