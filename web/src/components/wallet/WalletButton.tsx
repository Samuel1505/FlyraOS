'use client';

import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWallet } from '@/lib/context/WalletContext';
import { shortenAddress } from '@/lib/utils';

export default function WalletButton() {
  const { principal, isConnected, isLoading, connect, disconnect } = useWallet();

  if (isLoading) {
    return (
      <button className="btn-outline" disabled style={{ gap: '0.5rem', minWidth: '120px' }}>
        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
        Connecting…
      </button>
    );
  }

  if (isConnected && principal) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            padding: '0.375rem 0.75rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
          }}
        >
          {shortenAddress(principal)}
        </span>
        <button
          onClick={disconnect}
          title="Disconnect wallet"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--destructive)';
            e.currentTarget.style.borderColor = 'var(--destructive)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
        >
          <LogOut size={13} />
        </button>
      </div>
    );
  }

  return (
    <button className="btn-primary" onClick={connect}>
      <Wallet size={14} />
      Connect Wallet
    </button>
  );
}
