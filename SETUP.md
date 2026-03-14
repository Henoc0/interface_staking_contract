# Quick Setup Guide

## 1. Set Contract Address

You need to set your deployed StakingReward contract address. You have two options:

### Option A: Environment Variable (Recommended)
Create a `.env.local` file:
```env
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Option B: Direct Configuration
Edit `lib/config.ts` and update:
```typescript
export const CONTRACT_ADDRESSES = {
  STAKING_REWARD: '0xYourContractAddressHere',
}
```

## 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 3. Connect Your Wallet

- Click "Connect" button
- Select your wallet (MetaMask, WalletConnect, etc.)
- Make sure you're on the correct network (where your contract is deployed)

## Features Implemented

✅ Wallet connection (MetaMask, WalletConnect, Injected wallets)
✅ Real-time staking statistics dashboard
✅ Token approval handling
✅ Stake tokens
✅ Withdraw staked tokens
✅ Claim rewards
✅ Exit (withdraw all + claim all)
✅ Dark mode support
✅ Responsive design

## Contract Functions Used

- `stake(uint256)` - Stake tokens
- `withdraw(uint256)` - Withdraw tokens
- `getReward()` - Claim rewards
- `exit()` - Withdraw all + claim all
- `earned(address)` - Get pending rewards
- `balances(address)` - Get staked balance
- `totalSupply()` - Total staked
- `rewardRate()` - Current reward rate
- `periodFinish()` - Reward period end time
- `stakingToken()` - Staking token address
- `rewardsToken()` - Rewards token address

## Network Configuration

The app is configured for:
- Ethereum Mainnet
- Sepolia Testnet
- Localhost

To change networks, edit `lib/config.ts`.

