import { http, createConfig } from 'wagmi'
import { mainnet, base, bsc, arbitrum } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

const projectId = 'b1e32aed6f915e982334fa11b7b6156b'

export const config = createConfig({
  ssr: true,
  chains: [mainnet, base, bsc, arbitrum],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
  },
})