'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { StakingStats } from '@/components/StakingStats'
import { StakingActions } from '@/components/StakingActions'
import { CONTRACT_ADDRESSES } from '@/lib/config'

export default function Home() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!CONTRACT_ADDRESSES.STAKING_REWARD) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        {/* ... ton contenu inchangé ... */}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Staking Rewards
            </h1>
            <WalletConnect />
          </div>

          {/*  Guard monté — plus de mismatch serveur/client */}
          {mounted && !isConnected && (
            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
              Please connect your wallet to interact with the staking contract.
            </div>
          )}
        </header>

        {/*  Idem ici */}
        {mounted && isConnected && (
          <>
            <StakingStats />
            <StakingActions />
          </>
        )}
      </div>
    </div>
  )
}