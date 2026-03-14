"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>

        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}