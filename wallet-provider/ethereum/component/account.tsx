'use client'

import { useAccount } from 'wagmi'

export function Account() {
  const { address } = useAccount()

  return (
    <div className='flex flex-col gap-4 mt-10'>
      {address && <div>{address}</div>}
    </div>
  )
}