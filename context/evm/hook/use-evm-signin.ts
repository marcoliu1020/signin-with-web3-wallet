import { useState } from "react"
import { useAccount } from "wagmi"

// signin-pipe-work
import { signInPipeWork } from '@/context/signin-pipe-work'
import { evmAuthAdapter } from '@/context/evm/evm-auth-adapter'

export function useEvmSignin() {
    const { address, chainId } = useAccount()
    const [authStatus, setAuthStatus] = useState<'unauthenticated' | 'authenticated' | 'loading'>('unauthenticated')

    const handleEvmSignIn = async () => {
        if (authStatus === 'authenticated' || authStatus === 'loading') return
        if (!address || !chainId) throw new Error('Address or chainId is not set')

        try {
            setAuthStatus('loading')
            const signInFlow = signInPipeWork(address, chainId)
            const result = await signInFlow(evmAuthAdapter)
            if (!result.success) {
                throw new Error('Sign in failed')
            }
            setAuthStatus('authenticated')
            return true
        } catch (error) {
            console.error(error)
            setAuthStatus('unauthenticated')
            return false
        }
    }

    return {
        authStatus,
        handleEvmSignIn,
    }
}