# FlyraOS Frontend

A professional-grade Next.js frontend for the FlyraOS NFT treasury protocol on Stacks blockchain.

## Features

- **Wallet Integration**: Full Stacks Connect support for browser wallet connections
- **NFT Marketplace**: Browse, search, filter, and purchase NFTs with SIP-009 metadata support
- **Strategy Dashboard**: Real-time monitoring of protocol metrics, floor sweeps, and token burns
- **Liquidity Metrics**: Track STX/FRY pool performance and fee distribution
- **Admin Utilities**: Deployer-gated controls for floor sweeps, relists, and token burns
- **Professional Design**: Dark mode corporate aesthetic with responsive layouts

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Landing page
│   │   ├── marketplace/        # NFT marketplace
│   │   ├── dashboard/          # Strategy dashboard
│   │   ├── liquidity/          # Liquidity metrics
│   │   ├── admin/              # Admin utilities (protected)
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── globals.css         # Theme and design tokens
│   ├── components/             # Reusable React components
│   │   ├── common/             # Navbar, Footer, etc.
│   │   ├── wallet/             # Wallet-related components
│   │   └── marketplace/        # Marketplace components 
│   ├── hooks/                  # Custom React hooks
│   │   ├── useContract.ts      # Contract interactions
│   │   └── useNFTData.ts       # NFT data fetching
│   ├── lib/                    # Utilities and helpers
│   │   ├── context/            # React Context providers
│   │   ├── stacks/             # Stacks RPC utilities
│   │   ├── contracts/          # Contract helpers
│   │   └── utils.ts            #  Formatting helpers and explorer link builders
│   ├── types/                  # TypeScript interfaces
│   └── config.ts               # App configuration
└── public/                     # Static assets
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

Key variables to configure:

- `NEXT_PUBLIC_STACKS_NETWORK`: Network (testnet, devnet, mainnet)
- `NEXT_PUBLIC_STACKS_API`: Stacks API endpoint
- `NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS`: Your deployed contract address
- `NEXT_PUBLIC_DEPLOYER_PRINCIPAL`: Your principal (for admin access)

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 + Design Tokens
- **Blockchain**: Stacks Connect, @stacks/transactions
- **Data**: SWR for caching and state management
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Key Components

### Wallet Integration

The `WalletProvider` context manages wallet state using Stacks Connect:

```tsx
import { useWallet } from '@/lib/context/WalletContext';

export default function MyComponent() {
  const { principal, isConnected, connect, disconnect } = useWallet();
  // ...
}
```

### Contract Interactions

Use the `useContract` hook for smart contract operations:

```tsx
import { useContract } from '@/hooks/useContract';

const { buyNFT, floorSweep, isLoading } = useContract();

await buyNFT(tokenId, price);
```

### NFT Data

Fetch NFT metadata from SIP-009 URIs:

```tsx
import { useNFTMetadata } from '@/hooks/useNFTData';

const { metadata, isLoading } = useNFTMetadata(uri);
```

## API Integration

### NFT Marketplace Contract

- **Read**: `get-listings`, `get-listing`, `get-floor-price`, `get-stats`
- **Write**: `buy-nft`, `list-nft`, `floor-sweep`, `premium-relist` (admin)

### Strategy Token Contract

- **Read**: Balance and total supply queries
- **Write**: Token transfers and burns

### Liquidity Pool Contract

- **Read**: Pool stats, reserves, swap prices
- **Write**: Swaps and liquidity provision

## Design System

### Color Palette

The theme uses CSS variables defined in `globals.css`:

```css
--background: #0f0f0f
--foreground: #e5e7eb
--primary: #0754d1ff
--secondary: #010264ff
--accent: #10b981
--muted: #6b7280
```

### Typography

- **Sans**: Geist (headings and body)
- **Mono**: Geist Mono (code and addresses)

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Set environment variables in Vercel dashboard.

### Docker

```bash
docker build -t flyraos-web .
docker run -p 3000:3000 flyraos-web
```

## Development Workflow

### Adding a New Page

1. Create `src/app/[page]/page.tsx`
2. Use existing components from `src/components/`
3. Add navigation link in `Navbar.tsx`

### Adding a New Component

1. Create file in `src/components/[category]/`
2. Use existing design tokens and Tailwind utilities
3. Keep components focused and reusable

### Adding Contract Functions

1. Add utility functions in `src/lib/contracts/`
2. Use them in hooks like `useContract.ts`
3. Add TypeScript types in `src/types/index.ts`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STACKS_NETWORK` | Network | `testnet` |
| `NEXT_PUBLIC_STACKS_API` | API endpoint | `https://api.testnet.hiro.so` |
| `NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS` | Contract | `SP...` |
| `NEXT_PUBLIC_DEPLOYER_PRINCIPAL` | Admin principal | `ST...` |

## Troubleshooting

### Wallet Connection Issues

- Ensure browser wallet is installed and unlocked
- Check if correct network is selected in wallet
- Verify contract addresses in config

### NFT Metadata Loading

- Confirm SIP-009 URIs are accessible
- Check browser console for CORS errors
- Verify image URLs in metadata

### Contract Call Errors

- Check if testnet has STX balance for gas
- Verify contract addresses are deployed
- Review PostCondition settings

## Future Enhancements

- [ ] Trading history and analytics
- [ ] Offer system for NFTs
- [ ] Liquidity pool UI
- [ ] Token staking interface
- [ ] Governance features
- [ ] Mobile app

## Support

For issues and questions:

- **GitHub**: https://github.com/Samuel1505/FlyraOS
- **Discord**: [FlyraOS Community]
- **Email**: support@flyraos.com

## License

MIT License - See LICENSE file for details
