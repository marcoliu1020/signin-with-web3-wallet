'use client'

import { Account } from './account'
import { WalletOptions } from './wallet-options'
import { useAccount } from 'wagmi'

function ConnectWallet() {
  const { isConnected } = useAccount()

  if (isConnected) return <Account />
  return <WalletOptions />
}

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <ConnectWallet />
    </div>
  )
}