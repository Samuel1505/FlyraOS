export const STACKS_NETWORK =
  (process.env.NEXT_PUBLIC_STACKS_NETWORK as 'testnet' | 'devnet' | 'mainnet') ?? 'testnet';

export const STACKS_API =
  process.env.NEXT_PUBLIC_STACKS_API ?? 'https://api.testnet.hiro.so';

export const NFT_MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS ?? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const STRATEGY_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_STRATEGY_TOKEN_ADDRESS ?? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const LIQUIDITY_POOL_ADDRESS =
  process.env.NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS ?? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const DEPLOYER_PRINCIPAL =
  process.env.NEXT_PUBLIC_DEPLOYER_PRINCIPAL ?? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const APP_NAME = 'FlyraOS';
export const APP_ICON_URL = '/icon.png';

export const EXPLORER_BASE =
  STACKS_NETWORK === 'mainnet'
    ? 'https://explorer.hiro.so'
    : 'https://explorer.hiro.so/?chain=testnet';

export const STX_DECIMALS = 1_000_000; // 1 STX = 1,000,000 uSTX
export const FLYRA_DECIMALS = 1_000_000; // 6 decimals
