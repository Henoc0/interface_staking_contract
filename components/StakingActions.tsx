'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, maxUint256 } from 'viem'
import { CONTRACT_ADDRESSES } from '@/lib/config'
import StakingRewardABI from '@/lib/contracts/StakingReward.json'
import ERC20ABI from '@/lib/contracts/ERC20.json'

export function StakingActions() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [approveAmount, setApproveAmount] = useState('')

  const stakingContract = CONTRACT_ADDRESSES.STAKING_REWARD as `0x${string}`

  // Get staking token address
  const { data: stakingTokenAddress } = useReadContract({
    address: stakingContract,
    abi: StakingRewardABI,
    functionName: 'StakingToken',
    query: {
      enabled: !!stakingContract,
    },
  })

  // Get token decimals
  const { data: tokenDecimals } = useReadContract({
    address: stakingTokenAddress as `0x${string}` | undefined,
    abi: ERC20ABI,
    functionName: 'decimals',
    query: {
      enabled: !!stakingTokenAddress,
    },
  })

  const decimals = (tokenDecimals as number) || 18

  // Get current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: stakingTokenAddress as `0x${string}` | undefined,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: address && stakingContract ? [address, stakingContract] : undefined,
    query: {
      enabled: !!address && !!stakingTokenAddress && !!stakingContract,
    },
  })

  // Get user's staked balance
  const { data: stakedBalance, refetch: refetchBalance } = useReadContract({
    address: stakingContract,
    abi: StakingRewardABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!stakingContract,
    },
  })

  const handleApprove = async () => {
    if (!stakingTokenAddress || !stakingContract || !approveAmount) return

    const amount = approveAmount === 'max' ? maxUint256 : parseUnits(approveAmount, decimals)

    writeContract({
      address: stakingTokenAddress as `0x${string}`,
      abi: ERC20ABI,
      functionName: 'approve',
      args: [stakingContract, amount],
    })
  }

  const handleStake = async () => {
    if (!stakingContract || !stakeAmount) return

    const amount = parseUnits(stakeAmount, decimals)

    writeContract({
      address: stakingContract,
      abi: StakingRewardABI,
      functionName: 'stake',
      args: [amount],
    })
  }

  const handleWithdraw = async () => {
    if (!stakingContract || !withdrawAmount) return

    const amount = parseUnits(withdrawAmount, decimals)

    writeContract({
      address: stakingContract,
      abi: StakingRewardABI,
      functionName: 'withdraw',
      args: [amount],
    })
  }

  const handleGetReward = async () => {
    if (!stakingContract) return

    writeContract({
      address: stakingContract,
      abi: StakingRewardABI,
      functionName: 'getReward',
    })
  }

  const handleExit = async () => {
    if (!stakingContract) return

    writeContract({
      address: stakingContract,
      abi: StakingRewardABI,
      functionName: 'exit',
    })
  }

  // Refetch after successful transaction
  useEffect(() => {
    if (isConfirmed) {
        refetchAllowance()
        refetchBalance()
        setStakeAmount('')
        setWithdrawAmount('')
        setApproveAmount('')
    }
}, [isConfirmed])

  const stakedBalanceFormatted = stakedBalance
    ? parseFloat(formatUnits(stakedBalance as bigint, decimals)).toFixed(4)
    : '0'

  const needsApproval = stakeAmount
    ? (allowance as bigint | undefined) || 0 < parseUnits(stakeAmount, decimals)
    : false


  return (
    <div className="space-y-6">
      {/* Approve Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Approve Tokens</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Approve the staking contract to spend your tokens. Use &quot;max&quot; for unlimited approval.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
            placeholder="Amount or 'max'"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleApprove}
            disabled={isPending || isConfirming || !approveAmount}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>

      {/* Stake Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Stake Tokens</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Amount to stake"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleStake}
            // disabled={isPending || isConfirming || !stakeAmount || needsApproval}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming ? 'Processing...' : 'Stake'}
          </button>
        </div>
        {needsApproval && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Please approve tokens first
          </p>
        )}
      </div>

      {/* Withdraw Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Withdraw Tokens</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Your staked balance: {stakedBalanceFormatted}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Amount to withdraw"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleWithdraw}
            disabled={isPending || isConfirming || !withdrawAmount}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>

      {/* Claim Rewards Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Claim Rewards</h2>
        <button
          onClick={handleGetReward}
          disabled={isPending || isConfirming}
          className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending || isConfirming ? 'Processing...' : 'Claim Rewards'}
        </button>
      </div>

      {/* Exit Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Exit</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Withdraw all staked tokens and claim all rewards in one transaction.
        </p>
        <button
          onClick={handleExit}
          disabled={isPending || isConfirming || stakedBalanceFormatted === '0'}
          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending || isConfirming ? 'Processing...' : 'Exit (Withdraw All + Claim)'}
        </button>
      </div>

      {/* Transaction Status */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      )}

      {isConfirmed && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded">
          Transaction confirmed!
        </div>
      )}
    </div>
  )
}

