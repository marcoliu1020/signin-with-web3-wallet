'use client'

import { useState } from "react"
import { useAccount } from "wagmi"
import { signMessage } from '@wagmi/core';

// signin-pipe-work
import { signInPipeWork, type AuthenticationAdapter } from '@/context/signin-pipe-work'

// config
import { config } from '@/context/evm/config';

// api
import { getNonce } from '@/api/get-nonce';
import { getUserToken } from '@/api/get-user-token';

// util
import { setUserToken } from '@/util/user-token';

/** evm 錢包登入 */
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

/** evm 錢包認證適配器 */
export const evmAuthAdapter: AuthenticationAdapter = {
    getNonce: async ({ address }) => {
      const nonce = await getNonce({ address, chainType: 'ETHEREUM' }); // metamask 都是 ethereum
      return nonce;
    },
    createSignature: async ({ nonce }) => {
      // 可以用這個網站測試 https://etherscan.io/verifiedSignatures#
      const signature = await signMessage(config, { message: nonce });
      return signature;
    },
    verifySignature: async ({ address, signature }) => {
      const userToken = await getUserToken({ address, chainType: 'ETHEREUM', signature }); // metamask 都是 ethereum
      if (userToken.data.isSuccess) {
        // TODO: 儲存 userToken
        setUserToken(userToken.data.token)
      }
      return userToken.data.isSuccess;
    },
    signOut: async () => {
      // TODO: Implement sign out
    }
  }