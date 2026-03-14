'use client'

import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { CONTRACT_ADDRESSES } from '@/lib/config'
import StakingRewardABI from '@/lib/contracts/StakingReward.json'
import ERC20ABI from '@/lib/contracts/ERC20.json'
import { useEffect, useState } from 'react'

export function StakingStats() {
  const { address } = useAccount()
  const [stakingTokenDecimals, setStakingTokenDecimals] = useState<number>(18)
  const [rewardsTokenDecimals, setRewardsTokenDecimals] = useState<number>(18)
  const [stakingTokenSymbol, setStakingTokenSymbol] = useState<string>('')
  const [rewardsTokenSymbol, setRewardsTokenSymbol] = useState<string>('')

  // Get contract addresses
  const stakingContract = CONTRACT_ADDRESSES.STAKING_REWARD as `0x${string}`

  // Get staking and rewards token addresses
  const { data: tokenAddresses } = useReadContracts({
    contracts: [
      {
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: 'StakingToken',
      },
      {
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: 'RewardToken',
      },
    ],
  })

  const stakingTokenAddress = tokenAddresses?.[0]?.result as `0x${string}` | undefined
  const rewardsTokenAddress = tokenAddresses?.[1]?.result as `0x${string}` | undefined

  // Get token decimals and symbols
  const { data: tokenInfo } = useReadContracts({
    contracts: [
      ...(stakingTokenAddress
        ? [
            {
              address: stakingTokenAddress as `0x${string}`,
              abi: ERC20ABI,
              functionName: "decimals",
            },
            {
              address: stakingTokenAddress as `0x${string}`,
              abi: ERC20ABI,
              functionName: "symbol",
            },
          ]
        : []),
  
      ...(rewardsTokenAddress
        ? [
            {
              address: rewardsTokenAddress as `0x${string}`,
              abi: ERC20ABI,
              functionName: "decimals",
            },
            {
              address: rewardsTokenAddress as `0x${string}`,
              abi: ERC20ABI,
              functionName: "symbol",
            },
          ]
        : []),
    ] as const,
  });

  useEffect(() => {
    if (tokenInfo && stakingTokenAddress && rewardsTokenAddress) {
      const stakingDecimals = tokenInfo[0]?.result as number | undefined
      const stakingSymbol = tokenInfo[1]?.result as string | undefined
      const rewardsDecimals = tokenInfo[2]?.result as number | undefined
      const rewardsSymbol = tokenInfo[3]?.result as string | undefined

      if (stakingDecimals !== undefined) setStakingTokenDecimals(stakingDecimals)
      if (stakingSymbol) setStakingTokenSymbol(stakingSymbol)
      if (rewardsDecimals !== undefined) setRewardsTokenDecimals(rewardsDecimals)
      if (rewardsSymbol) setRewardsTokenSymbol(rewardsSymbol)
    }
  }, [tokenInfo, stakingTokenAddress, rewardsTokenAddress])

  // Get user's staking balance
  const { data: userBalance } = useReadContract({
    address: stakingContract,
    abi: StakingRewardABI,
    functionName: 'balance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!stakingContract,
    },
  })

  // Get user's earned rewards
  const { data: earnedRewards } = useReadContract({
    address: stakingContract,
    abi: StakingRewardABI,
    functionName: 'earned',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!stakingContract,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: stakingContract,
    abi: StakingRewardABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!stakingContract,
    },
  })

  // Get reward rate and period finish
  const { data: rewardInfo } = useReadContracts({
    contracts: [
      {
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: 'rewardRate',
      },
      {
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: 'periodFinish',
      },
      {
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: 'rewardsDuration',
      },
    ],
    query: {
      enabled: !!stakingContract,
    },
  })

  const rewardRate = rewardInfo?.[0]?.result as bigint | undefined
  const periodFinish = rewardInfo?.[1]?.result as bigint | undefined
  const rewardsDuration = rewardInfo?.[2]?.result as bigint | undefined

  // Get user's wallet balance of staking token
  const { data: walletBalance } = useReadContract({
    address: stakingTokenAddress,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!stakingTokenAddress,
    },
  })

  const formatTokenAmount = (amount: bigint | undefined, decimals: number) => {
    if (!amount) return '0.00'
    return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  }

  const formatTimeRemaining = (finish: bigint | undefined) => {
    if (!finish) return 'N/A'
    const now = BigInt(Math.floor(Date.now() / 1000))
    if (finish <= now) return 'Ended'
    const remaining = Number(finish - now)
    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Your Staked Balance
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatTokenAmount(userBalance as bigint | undefined, stakingTokenDecimals)}{' '}
          {stakingTokenSymbol}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Pending Rewards
        </h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatTokenAmount(earnedRewards as bigint | undefined, rewardsTokenDecimals)}{' '}
          {rewardsTokenSymbol}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Wallet Balance
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatTokenAmount(walletBalance as bigint | undefined, stakingTokenDecimals)}{' '}
          {stakingTokenSymbol}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Total Staked
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatTokenAmount(totalSupply as bigint | undefined, stakingTokenDecimals)}{' '}
          {stakingTokenSymbol}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Reward Rate
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {rewardRate
            ? `${formatTokenAmount(rewardRate, rewardsTokenDecimals)} ${rewardsTokenSymbol}/sec`
            : 'N/A'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Time Remaining
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatTimeRemaining(periodFinish)}
        </p>
      </div>
    </div>
  )
}

