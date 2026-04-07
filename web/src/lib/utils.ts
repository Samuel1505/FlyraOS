import { EXPLORER_BASE, STX_DECIMALS, FLYRA_DECIMALS } from '@/config';

/** Format uSTX → STX with 2 decimal places */
export function formatSTX(uSTX: number): string {
  return (uSTX / STX_DECIMALS).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Format uFLYRA → FLYRA with 2 decimal places */
export function formatFLYRA(uFLYRA: number): string {
  return (uFLYRA / FLYRA_DECIMALS).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Shorten a Stacks principal for display */
export function shortenAddress(address: string, chars = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

/** Build an explorer link for a transaction */
export function explorerTxLink(txId: string): string {
  return `${EXPLORER_BASE}/txid/${txId}`;
}

/** Build an explorer link for an address */
export function explorerAddressLink(address: string): string {
  return `${EXPLORER_BASE}/address/${address}`;
}

/** Format a large number with K/M suffix */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/** Format date from ISO string to readable label */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
