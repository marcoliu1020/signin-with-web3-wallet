'use client'

import { useAccount } from 'wagmi'

import { useEthereumWallet } from '@/wallet-provider/ethereum'

export function Account() {
  const { address } = useAccount()
  const { signInBackend } = useEthereumWallet()

  const handleSignIn = async () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    const result = await signInBackend(address)
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