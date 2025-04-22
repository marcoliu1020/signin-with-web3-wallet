'use client'

import { useAccount, useDisconnect } from 'wagmi'

export function Account() {
  const { disconnect } = useDisconnect()
  const { address } = useAccount()

  return (
    <div className='flex flex-col gap-4'>
      {address && <div>{address}</div>}
      <button onClick={() => disconnect()} className='border border-gray-300 rounded-md p-2'>Disconnect</button>
    </div>
  )
}