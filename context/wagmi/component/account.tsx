'use client'

import { useAccount, useDisconnect } from 'wagmi'

// context
import { signInPipeWork } from '@/context/signin-pipe-work'
import { evmAuthFlow } from '@/context/wagmi/evm-auth-flow'

export function Account() {
  const { address, chainId } = useAccount()
  const { disconnect } = useDisconnect()

  const handleSignIn = async () => {
    if (!address || !chainId) {
      throw new Error('Address or chainId is not set')
    }
    const signInFlow = signInPipeWork(address, chainId)
    const result = await signInFlow(evmAuthFlow)
    if (result.success) {
      alert('sign in success')
    } else {
      alert('sign in failed')
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      {address && <div>{address}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
      <button onClick={handleSignIn}> Sign in </button>
    </div>
  )
}