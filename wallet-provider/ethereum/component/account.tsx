'use client'

import { useAccount } from 'wagmi'

import { useEthereumWallet } from '@/wallet-provider/ethereum'

export function Account() {
  const { address } = useAccount()
  const { signInBackend } = useEthereumWallet()

  const handleSignIn = async () => {
    const result = await signInBackend()
    if (result) {
      alert('sign in success ✅')
    }
  }

  return (
    <div className='flex flex-col gap-4 mt-10'>
      {address && <div>{address}</div>}
      <button onClick={handleSignIn} className='border border-gray-300 rounded-md p-2'>Sign In</button>
    </div>
  )
}