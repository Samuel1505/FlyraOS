import { NFT_MARKETPLACE_ADDRESS } from '@/config';
import { callReadOnly } from '@/lib/stacks/api';

const CONTRACT_NAME = 'nft-marketplace';

export interface RawListing {
  maker: string;
  price: number;
}

/** Fetch a specific listing from the contract */
export async function getListing(
  nftContractAddress: string,
  tokenId: number,
): Promise<RawListing | null> {
  try {
    const result = await callReadOnly<{ value?: { data: { maker: { value: string }; price: { value: string } } } }>(
      NFT_MARKETPLACE_ADDRESS,
      CONTRACT_NAME,
      'get-listing',
      [],
    );
    if (!result?.value) return null;
    return {
      maker: result.value.data.maker.value,
      price: parseInt(result.value.data.price.value),
    };
  } catch {
    return null;
  }
}

/** Get the Stacks post-conditions for buying an NFT */
export function buildBuyArgs(nftContractAddress: string, tokenId: number) {
  return { nftContractAddress, tokenId };
}
