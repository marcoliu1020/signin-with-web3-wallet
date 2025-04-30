'use client'

import { useEffect, useState } from 'react'
import { type Connector, useAccount, useConnect } from 'wagmi'
import { useEthereumWallet } from '..'

export function WalletOptions() {
  const { connectors } = useConnect()
  const metaMaskConnector = connectors.find(connector => connector.type === 'metaMask')
  const walletConnectConnector = connectors.find(connector => connector.type === 'walletConnect')

  return (
    <div className='flex flex-col gap-4 mt-5'>
      <EthereumWalletButton connector={metaMaskConnector} walletName='MetaMask' />
      <EthereumWalletButton connector={walletConnectConnector} walletName='WalletConnect' />
    </div>
  )
}

type EthereumWalletButtonProps = {
  connector: Connector | undefined
  walletName: string
}

export function EthereumWalletButton({ connector, walletName }: EthereumWalletButtonProps) {
  const [ready, setReady] = useState(false)

  // wagmi hooks
  const { isConnected, address } = useAccount()
  const { connectAsync } = useConnect()
  
  const { signInBackend } = useEthereumWallet()

  const handleConnectAndSignIn = async () => {
    let currentAddress = address

    try {
      if (!connector) {
        alert(`${walletName} connector not found`)
        return
      }

      // connect wallet
      if (!isConnected) {
        const { accounts } = await connectAsync({ connector: connector })
        currentAddress = accounts[0]
      }
      // ---

      if (!currentAddress) {
        alert(`${walletName} wallet: Address is not set`)
        return
      }

      const isSignIn = await signInBackend(currentAddress)
      if (isSignIn) {
        alert(`${walletName} sign in to backend successfully ✅`)
      } else {
        alert(`${walletName} sign in to backend failed ❌`)
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`${walletName} sign in to backend failed ❌: ${errorMessage}`)
    }
  }

  useEffect(() => {
    (async () => {
      const provider = await connector?.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button
      disabled={!ready}
      onClick={handleConnectAndSignIn}
      className='border border-gray-300 rounded-md p-2'
    >
      {walletName} connect
    </button>
  )
}