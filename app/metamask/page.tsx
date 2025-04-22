'use client'

import { useAccount } from 'wagmi'
import { Account } from '@/context/wagmi/component/account'
import { WalletOptions } from '@/context/wagmi/component/wallet-options'

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <ConnectWallet />
    </div>
  )
}

function ConnectWallet() {
  const { isConnected } = useAccount()

  if (isConnected) return <Account />
  return <WalletOptions />
}