import { STRATEGY_TOKEN_ADDRESS } from '@/config';
import { callReadOnly } from '@/lib/stacks/api';

const CONTRACT_NAME = 'strategy-token';

/** Fetch FLYRA balance for an address */
export async function getFLYRABalance(address: string): Promise<number> {
  try {
    const result = await callReadOnly<{ value: string }>(
      STRATEGY_TOKEN_ADDRESS,
      CONTRACT_NAME,
      'get-balance',
      [`0x${Buffer.from(address).toString('hex')}`],
      address,
    );
    return parseInt(result?.value ?? '0');
  } catch {
    return 0;
  }
}

/** Fetch total FLYRA supply */
export async function getFLYRASupply(): Promise<number> {
  try {
    const result = await callReadOnly<{ value: string }>(
      STRATEGY_TOKEN_ADDRESS,
      CONTRACT_NAME,
      'get-total-supply',
    );
    return parseInt(result?.value ?? '0');
  } catch {
    return 0;
  }
}
