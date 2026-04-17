'use client';

import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWallet } from '@/lib/context/WalletContext';
import { shortenAddress } from '@/lib/utils';

export default function WalletButton() {
  const { principal, bns, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet();

  if (isLoading) {
    return (
      <button className="btn-outline" disabled style={{ minWidth: '120px', fontSize: '0.8rem' }}>
        <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
        Connecting…
      </button>
    );
  }

  if (isConnected && principal) {
    return (
      <button
        onClick={disconnectWallet}
        title="Disconnect wallet"
        aria-label="Disconnect wallet"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--destructive)';
          e.currentTarget.style.borderColor = 'var(--destructive-border)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-default)';
        }}
      >
        <span
          aria-hidden
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--success)',
            flexShrink: 0,
          }}
        />
        {bns ? bns : shortenAddress(principal)}
        <LogOut size={12} style={{ marginLeft: '0.125rem', opacity: 0.6 }} />
      </button>
    );
  }

  return (
    <button className="btn-primary" onClick={connectWallet} style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
      <Wallet size={13} />
      Connect Wallet
    </button>
  );
}
