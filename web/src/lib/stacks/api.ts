import { STACKS_API } from '@/config';

/** Call a read-only Clarity function on the Stacks API */
export async function callReadOnly<T = unknown>(
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: string[] = [],
  senderAddress?: string,
): Promise<T> {
  const url = `${STACKS_API}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: senderAddress ?? contractAddress,
      arguments: args,
    }),
  });
  if (!res.ok) throw new Error(`Stacks API error: ${res.status}`);
  const data = await res.json();
  return data.result as T;
}

/** Fetch account STX balance */
export async function getSTXBalance(address: string): Promise<number> {
  const res = await fetch(`${STACKS_API}/v2/accounts/${address}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return parseInt(data.balance ?? '0', 16);
}
