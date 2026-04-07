'use client';

import useSWR from 'swr';
import type { NFTMetadata, NFTListing } from '@/types';

const jsonFetcher = (url: string) => fetch(url).then((r) => r.json());

/** Fetch NFT metadata from a SIP-009 URI */
export function useNFTMetadata(uri: string | null | undefined) {
  const { data, error, isLoading } = useSWR<NFTMetadata>(
    uri ?? null,
    jsonFetcher,
    { revalidateOnFocus: false },
  );
  return { metadata: data, isLoading, error };
}

/** Mock hook returning sample NFT listings (replace with real contract reads) */
export function useNFTListings() {
  const { data, error, isLoading } = useSWR<NFTListing[]>(
    'nft-listings',
    () =>
      Promise.resolve(
        Array.from({ length: 12 }, (_, i) => ({
          tokenId: i + 1,
          maker: `ST${Math.random().toString(36).slice(2, 10).toUpperCase()}XXXX`,
          price: Math.floor(Math.random() * 50 + 5) * 1_000_000,
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-marketplace',
          metadata: {
            name: `FlyraOS #${i + 1}`,
            description: 'A unique FlyraOS protocol NFT',
            image: `https://picsum.photos/seed/flyra${i + 1}/400/400`,
            attributes: [
              { trait_type: 'Tier', value: ['Common', 'Rare', 'Epic', 'Legendary'][i % 4] },
              { trait_type: 'Power', value: String(Math.floor(Math.random() * 100)) },
            ],
          },
        })),
      ),
    { revalidateOnFocus: false },
  );
  return { listings: data ?? [], isLoading, error };
}

/** Mock hook for protocol stats */
export function useProtocolStats() {
  const { data, isLoading } = useSWR(
    'protocol-stats',
    () =>
      Promise.resolve({
        totalListings: 247,
        floorPrice: 8_000_000,
        totalVolume: 1_340_000_000,
        totalBurned: 4_200_000_000,
        flyraSupply: 21_000_000_000_000,
      }),
    { revalidateOnFocus: false },
  );
  return { stats: data, isLoading };
}

/** Mock floor price history for charts */
export function useFloorPriceHistory() {
  const { data, isLoading } = useSWR(
    'floor-price-history',
    () => {
      const now = Date.now();
      return Promise.resolve(
        Array.from({ length: 30 }, (_, i) => ({
          date: new Date(now - (29 - i) * 86_400_000).toISOString().slice(0, 10),
          price: parseFloat(
            (7 + Math.sin(i / 5) * 2 + Math.random() * 1).toFixed(2),
          ),
        })),
      );
    },
    { revalidateOnFocus: false },
  );
  return { history: data ?? [], isLoading };
}

/** Mock burn events */
export function useBurnHistory() {
  const { data, isLoading } = useSWR(
    'burn-history',
    () => {
      const now = Date.now();
      return Promise.resolve(
        Array.from({ length: 14 }, (_, i) => ({
          date: new Date(now - (13 - i) * 86_400_000).toISOString().slice(0, 10),
          amount: Math.floor(Math.random() * 500_000 + 100_000),
        })),
      );
    },
    { revalidateOnFocus: false },
  );
  return { burns: data ?? [], isLoading };
}
