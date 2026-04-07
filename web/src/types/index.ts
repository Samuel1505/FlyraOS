export interface NFTListing {
  tokenId: number;
  maker: string;
  price: number; // in uSTX
  contractAddress: string;
  metadata?: NFTMetadata;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface PoolDetails {
  stxBalance: number;   // in uSTX
  tokenBalance: number; // in uFLYRA
  feeRate: number;      // basis points (3 = 0.3%)
}

export interface ProtocolStats {
  totalListings: number;
  floorPrice: number;  // in uSTX
  totalVolume: number; // in uSTX
  totalBurned: number; // in uFLYRA
  flyraSupply: number; // in uFLYRA
}

export interface FloorPricePoint {
  date: string;
  price: number;
}

export interface BurnEvent {
  date: string;
  amount: number;
}

export type NetworkType = 'testnet' | 'devnet' | 'mainnet';
