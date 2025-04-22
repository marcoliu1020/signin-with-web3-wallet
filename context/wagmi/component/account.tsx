'use client'

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

// signin-pipe-work
import { signInPipeWork } from '@/context/signin-pipe-work'
import { evmAuthFlow } from '@/context/wagmi/evm-auth-flow'

export function Account() {
  const { disconnect } = useDisconnect()
  const { address, chainId } = useAccount()
  const [authStatus, setAuthStatus] = useState<'unauthenticated' | 'authenticated' | 'loading'>('unauthenticated')

  // this is effect event
  const handleSignIn = async () => {
    if (authStatus === 'authenticated' || authStatus === 'loading') return
    if (!address || !chainId) throw new Error('Address or chainId is not set')

    try {
      setAuthStatus('loading')
      const signInFlow = signInPipeWork(address, chainId)
      const result = await signInFlow(evmAuthFlow)
      if (!result.success) {
        throw new Error('Sign in failed')
      }
      setAuthStatus('authenticated')
      alert('sign in success')
    } catch (error) {
      console.error(error)
      setAuthStatus('unauthenticated')
      alert('sign in failed')
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      {address && <div>{address}</div>}
      <button onClick={() => disconnect()} className='border border-gray-300 rounded-md p-2'>Disconnect</button>
      <button onClick={handleSignIn} className='border border-gray-300 rounded-md p-2'>Sign in</button>
    </div>
  )
}