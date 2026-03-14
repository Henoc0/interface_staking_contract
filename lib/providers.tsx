'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState } from 'wagmi'
import { config } from './config'
import { useState } from 'react'

export function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode
  cookie?: string | null
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ Évite les refetch inutiles qui spamment le RPC
        staleTime: 10_000,
        retry: 1,
      },
    },
  }))

  const initialState = cookieToInitialState(config, cookie)

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}