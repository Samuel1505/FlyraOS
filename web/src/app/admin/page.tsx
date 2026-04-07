'use client';

import { useState } from 'react';
import {
  Shield,
  ShoppingBag,
  RefreshCw,
  Flame,
  Lock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useWallet } from '@/lib/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import { DEPLOYER_PRINCIPAL, NFT_MARKETPLACE_ADDRESS } from '@/config';
import { explorerTxLink, formatFLYRA } from '@/lib/utils';
import { FLYRA_DECIMALS } from '@/config';

export default function AdminPage() {
  const { principal, isConnected, connect } = useWallet();
  const { floorSweep, burnFLYRA, isLoading, txStatus, txId } = useContract();

  const isAdmin = isConnected && principal === DEPLOYER_PRINCIPAL;

  // Floor Sweep state
  const [sweepTokenId, setSweepTokenId] = useState('');

  // Burn state
  const [burnAmount, setBurnAmount] = useState('');

  async function handleFloorSweep(e: React.FormEvent) {
    e.preventDefault();
    if (!sweepTokenId) return;
    try {
      await floorSweep(NFT_MARKETPLACE_ADDRESS + '.nft-marketplace', parseInt(sweepTokenId));
      setSweepTokenId('');
    } catch {
      // handled by hook
    }
  }

  async function handleBurn(e: React.FormEvent) {
    e.preventDefault();
    if (!burnAmount) return;
    try {
      await burnFLYRA(parseFloat(burnAmount) * FLYRA_DECIMALS);
      setBurnAmount('');
    } catch {
      // handled by hook
    }
  }

  if (!isConnected) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '6rem auto',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: 'var(--warning)',
            marginBottom: '1.25rem',
          }}
        >
          <Lock size={24} />
        </span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Access Restricted
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Admin panel requires a connected wallet. Only the deployer principal has
          access to these controls.
        </p>
        <button className="btn-primary" onClick={connect}>
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '6rem auto',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--destructive)',
            marginBottom: '1.25rem',
          }}
        >
          <Shield size={24} />
        </span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Unauthorized
        </h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Admin only — connect with the deployer wallet to access these controls.
        </p>
        <p
          style={{
            marginTop: '1rem',
            padding: '0.5rem 0.875rem',
            background: 'var(--bg-elevated)',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            wordBreak: 'break-all',
          }}
        >
          {principal}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <p className="label-meta">Admin</p>
          <span
            className="badge"
            style={{
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            ✓ Deployer Access
          </span>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          Admin Panel
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Deployer-gated controls for floor sweeps, relisting, and token burns.
        </p>
      </div>

      {/* Tx Status Banner */}
      {txStatus !== 'idle' && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            ...(txStatus === 'success'
              ? {
                  background: 'var(--accent-dim)',
                  borderColor: 'rgba(16,185,129,0.3)',
                  color: 'var(--accent)',
                }
              : txStatus === 'error'
              ? {
                  background: 'rgba(239,68,68,0.1)',
                  borderColor: 'rgba(239,68,68,0.3)',
                  color: 'var(--destructive)',
                }
              : {
                  background: 'var(--primary-dim)',
                  borderColor: 'rgba(7,84,209,0.3)',
                  color: '#60a5fa',
                }),
          }}
        >
          {txStatus === 'success' ? (
            <CheckCircle size={15} />
          ) : txStatus === 'error' ? (
            <XCircle size={15} />
          ) : (
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
          )}
          {txStatus === 'success' && txId ? (
            <span>
              Transaction submitted.{' '}
              <a
                href={explorerTxLink(txId)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'underline' }}
              >
                View on Explorer <ExternalLink size={11} />
              </a>
            </span>
          ) : txStatus === 'error' ? (
            'Transaction failed. Please try again.'
          ) : (
            'Transaction pending — approve in your wallet…'
          )}
        </div>
      )}

      {/* Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Floor Sweep */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(7,84,209,0.12)',
                border: '1px solid rgba(7,84,209,0.25)',
                color: 'var(--primary)',
              }}
            >
              <ShoppingBag size={16} />
            </span>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Floor Sweep</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Sweep an NFT and relist at premium
              </p>
            </div>
          </div>
          <form onSubmit={handleFloorSweep} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label className="label-meta" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Token ID
              </label>
              <input
                className="input-field"
                type="number"
                min="1"
                placeholder="e.g. 42"
                value={sweepTokenId}
                onChange={(e) => setSweepTokenId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-meta" style={{ display: 'block', marginBottom: '0.4rem' }}>
                NFT Contract
              </label>
              <input
                className="input-field"
                type="text"
                value={`${NFT_MARKETPLACE_ADDRESS}.nft-marketplace`}
                readOnly
                style={{ opacity: 0.6, cursor: 'not-allowed', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !sweepTokenId}
              style={{ marginTop: '0.25rem' }}
            >
              {isLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ShoppingBag size={14} />}
              Execute Floor Sweep
            </button>
          </form>
        </div>

        {/* Burn Tokens */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: 'var(--destructive)',
              }}
            >
              <Flame size={16} />
            </span>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Burn FLYRA</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Permanently reduce circulating supply
              </p>
            </div>
          </div>
          <form onSubmit={handleBurn} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label className="label-meta" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Amount (FLYRA)
              </label>
              <input
                className="input-field"
                type="number"
                min="0.000001"
                step="any"
                placeholder="e.g. 1000.00"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                required
              />
              {burnAmount && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  ≈ {formatFLYRA(parseFloat(burnAmount) * FLYRA_DECIMALS)} FLYRA (
                  {parseFloat(burnAmount) * FLYRA_DECIMALS} uFLYRA)
                </p>
              )}
            </div>

            {/* Warning */}
            <div
              style={{
                padding: '0.75rem',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'rgba(239,68,68,0.9)',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <XCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
              Burns are irreversible. Tokens will be permanently destroyed.
            </div>

            <button
              type="submit"
              disabled={isLoading || !burnAmount}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                background: isLoading || !burnAmount ? 'rgba(239,68,68,0.4)' : 'var(--destructive)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: '0.875rem',
                border: 'none',
                cursor: isLoading || !burnAmount ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
                marginTop: '0.25rem',
              }}
            >
              {isLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Flame size={14} />}
              Burn Tokens
            </button>
          </form>
        </div>

        {/* Relist Info */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: 'var(--accent)',
              }}
            >
              <RefreshCw size={16} />
            </span>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Premium Relist</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Auto-relisting via sweep-and-relist
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
            The <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>sweep-and-relist</code>{' '}
            function in the strategy token contract automatically handles floor sweeping
            and premium relisting in a single transaction.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Use the{' '}
            <strong style={{ color: 'var(--foreground)' }}>Floor Sweep</strong> action
            above to trigger this flow — the contract handles the relist logic
            internally.
          </p>
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              background: 'var(--bg-elevated)',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            (define-public (sweep-and-relist (nft-contract ...) (token-id uint)))
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
