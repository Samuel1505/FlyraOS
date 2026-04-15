'use client';

import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWallet } from '@/lib/context/WalletContext';
import { shortenAddress } from '@/lib/utils';

export default function WalletButton() {
  const { principal, bns, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet();

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
      <button
        onClick={disconnectWallet}
        title="Disconnect wallet"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          cursor: 'pointer',
          transition: 'color 0.15s, border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--destructive)';
          e.currentTarget.style.borderColor = 'var(--destructive)';
          e.currentTarget.style.background = 'var(--bg-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--accent)';
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.background = 'var(--bg-elevated)';
        }}
      >
        {bns ? bns : shortenAddress(principal)}
        <LogOut size={13} style={{ marginLeft: '0.25rem' }} />
      </button>
    );
  }

  return (
    <button className="btn-primary" onClick={connectWallet}>
      <Wallet size={14} />
      Connect Wallet
    </button>
  );
}
