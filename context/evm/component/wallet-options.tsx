'use client'

import { useEffect, useState } from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  // Only show MetaMask and WalletConnect
  const filteredConnectors = connectors.filter(
    (connector) => connector.type === 'metaMask' || connector.type === 'walletConnect'
  )

  return (
    <div className='flex flex-col gap-4'>
      {filteredConnectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
    </div>
  )
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button disabled={!ready} onClick={onClick} className='border border-gray-300 rounded-md p-2'>
      {connector.name}
    </button>
  )
}