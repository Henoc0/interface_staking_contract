# Staking Rewards Frontend

A modern Next.js frontend for interacting with the StakingReward smart contract.

## Features

- 🔌 Wallet connection (MetaMask, WalletConnect, Injected)
- 📊 Real-time staking statistics
- 💰 Stake and withdraw tokens
- 🎁 Claim rewards
- 🚪 Exit (withdraw all + claim) functionality
- ⚡ Automatic token approval handling
- 🌙 Dark mode support

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required: Your deployed StakingReward contract address
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0xYourContractAddressHere

# Optional: WalletConnect Project ID (get one from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Alternatively, you can directly update the contract address in `lib/config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  STAKING_REWARD: '0xYourContractAddressHere',
}
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect Wallet**: Click the "Connect" button and select your preferred wallet
2. **View Stats**: See your staked balance, pending rewards, and contract statistics
3. **Approve Tokens**: First-time users need to approve the contract to spend their tokens
4. **Stake**: Enter an amount and click "Stake" to deposit tokens
5. **Withdraw**: Withdraw some or all of your staked tokens
6. **Claim Rewards**: Claim your earned rewards
7. **Exit**: Withdraw all staked tokens and claim all rewards in one transaction

## Contract Interface

The frontend interacts with the following contract functions:

- `stake(uint256 amount)` - Stake tokens
- `withdraw(uint256 amount)` - Withdraw staked tokens
- `getReward()` - Claim rewards
- `exit()` - Withdraw all and claim rewards
- `earned(address account)` - Get pending rewards
- `balances(address account)` - Get staked balance
- `totalSupply()` - Get total staked amount
- `rewardRate()` - Get current reward rate
- `periodFinish()` - Get reward period end time

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx             # Main staking page
│   └── globals.css          # Global styles
├── components/
│   ├── WalletConnect.tsx    # Wallet connection component
│   ├── StakingStats.tsx     # Statistics display
│   └── StakingActions.tsx   # Action buttons (stake, withdraw, etc.)
├── lib/
│   ├── config.ts            # Wagmi configuration
│   ├── providers.tsx        # Web3 providers wrapper
│   └── contracts/
│       ├── StakingReward.json  # Contract ABI
│       └── ERC20.json          # ERC20 ABI
└── package.json
```

## Technologies

- **Next.js 16** - React framework
- **Wagmi** - React Hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling

## Network Support

The app is configured to work with:
- Ethereum Mainnet
- Sepolia Testnet
- Localhost (for local development)

You can modify the chains in `lib/config.ts` to add or remove networks.

## Troubleshooting

### "Configuration Required" Message

Make sure you've set the `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS` environment variable or updated it in `lib/config.ts`.

### Transaction Failures

- Ensure you have enough ETH for gas fees
- Check that you've approved enough tokens (use "max" for unlimited approval)
- Verify the contract is not paused
- Make sure you're connected to the correct network

### Wallet Connection Issues

- Make sure you have a Web3 wallet installed (MetaMask, etc.)
- Check that your wallet is unlocked
- Try refreshing the page

## License

MIT
