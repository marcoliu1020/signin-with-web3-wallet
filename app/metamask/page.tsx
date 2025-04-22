'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'

// component
import { Account } from '@/context/wagmi/component/account'
import { WalletOptions } from '@/context/wagmi/component/wallet-options'

// hook
import { useEvmSignin } from '@/context/wagmi/hook/use-evm-signin'

// util
import { getUserToken } from '@/util/user-token'

export default function MetamaskPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <ConnectWallet />
    </div>
  )
}

function ConnectWallet() {
  const { isConnected } = useAccount()
  const { authStatus, handleEvmSignIn } = useEvmSignin()

  useEffect(() => {
    // 如果已經有 userToken，則不進行 signin
    const userToken = getUserToken()
    if (userToken) {
      console.log('userToken', userToken)
      return
    }

    // 執行 signin
    (async () => {
      if (isConnected && authStatus === 'unauthenticated') {
        const hasSignedIn = await handleEvmSignIn()
        if (hasSignedIn) {
          alert('signed in')
        } else {
          alert('signed in failed')
        }
      }
    })()
  }, [isConnected, authStatus, handleEvmSignIn])

  if (isConnected) return <Account />
  return <WalletOptions />
}