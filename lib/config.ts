import { createConfig, http } from 'wagmi'
import { sepolia, localhost } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// ✅ Pas de metaMask() ici — il sera ajouté dynamiquement côté client
export const config = createConfig({
  chains: [sepolia, localhost],
  ssr: true,
  connectors: [
    injected(), // Détecte MetaMask automatiquement via window.ethereum, sans SDK
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [sepolia.id]: http(),
    [localhost.id]: http('http://127.0.0.1:8545'), // ✅ URL explicite pour le local
  },
})

export const CONTRACT_ADDRESSES = {
  STAKING_REWARD: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || '',
}

export type ContractAddresses = typeof CONTRACT_ADDRESSES