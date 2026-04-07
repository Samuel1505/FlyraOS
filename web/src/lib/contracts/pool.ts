import { LIQUIDITY_POOL_ADDRESS } from '@/config';
import { callReadOnly } from '@/lib/stacks/api';
import type { PoolDetails } from '@/types';

const CONTRACT_NAME = 'liquidity-pool';

/** Fetch pool details (balances, fee rate) */
export async function getPoolDetails(): Promise<PoolDetails> {
  try {
    const result = await callReadOnly<{
      value: {
        data: {
          'stx-balance': { value: string };
          'token-balance': { value: string };
          'fee-rate': { value: string };
        };
      };
    }>(LIQUIDITY_POOL_ADDRESS, CONTRACT_NAME, 'get-pool-details');

    const data = result?.value?.data;
    return {
      stxBalance: parseInt(data?.['stx-balance']?.value ?? '0'),
      tokenBalance: parseInt(data?.['token-balance']?.value ?? '0'),
      feeRate: parseInt(data?.['fee-rate']?.value ?? '3'),
    };
  } catch {
    return { stxBalance: 0, tokenBalance: 0, feeRate: 3 };
  }
}

/** Calculate tokens received for a given STX input (XYK) */
export function calcTokensOut(
  stxIn: number,
  stxReserve: number,
  tokenReserve: number,
): number {
  if (stxReserve === 0 || tokenReserve === 0) return 0;
  const k = stxReserve * tokenReserve;
  const newStx = stxReserve + stxIn;
  const newToken = k / newStx;
  return tokenReserve - newToken;
}

/** Calculate STX received for a given token input (XYK) */
export function calcSTXOut(
  tokenIn: number,
  stxReserve: number,
  tokenReserve: number,
): number {
  if (stxReserve === 0 || tokenReserve === 0) return 0;
  const k = stxReserve * tokenReserve;
  const newToken = tokenReserve + tokenIn;
  const newStx = k / newToken;
  return stxReserve - newStx;
}
