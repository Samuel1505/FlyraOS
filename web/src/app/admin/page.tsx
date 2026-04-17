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
  const { principal, isConnected, connectWallet } = useWallet();
  const { floorSweep, burnFLYRA, isLoading, txStatus, txId } = useContract();

  const isAdmin = isConnected && principal === DEPLOYER_PRINCIPAL;

  const [sweepTokenId, setSweepTokenId] = useState('');
  const [burnAmount,   setBurnAmount]   = useState('');

  async function handleFloorSweep(e: React.FormEvent) {
    e.preventDefault();
    if (!sweepTokenId) return;
    try {
      await floorSweep(NFT_MARKETPLACE_ADDRESS + '.nft-marketplace', parseInt(sweepTokenId));
      setSweepTokenId('');
    } catch { /* handled by hook */ }
  }

  async function handleBurn(e: React.FormEvent) {
    e.preventDefault();
    if (!burnAmount) return;
    try {
      await burnFLYRA(parseFloat(burnAmount) * FLYRA_DECIMALS);
      setBurnAmount('');
    } catch { /* handled by hook */ }
  }

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div
        style={{
          maxWidth: '400px',
          margin: '7rem auto',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--warning-dim)',
            border: '1px solid var(--warning-border)',
            color: 'var(--warning)',
            marginBottom: '1.25rem',
          }}
          aria-hidden
        >
          <Lock size={20} />
        </span>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '0.625rem',
            letterSpacing: '-0.025em',
          }}
        >
          Access Restricted
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.65, fontSize: '0.875rem' }}>
          Admin panel requires a connected wallet. Only the deployer principal has access to these controls.
        </p>
        <button className="btn-primary" onClick={connectWallet}>
          <Shield size={14} />
          Connect Wallet
        </button>
      </div>
    );
  }

  /* ── Wrong wallet ── */
  if (!isAdmin) {
    return (
      <div
        style={{
          maxWidth: '400px',
          margin: '7rem auto',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--destructive-dim)',
            border: '1px solid var(--destructive-border)',
            color: 'var(--destructive)',
            marginBottom: '1.25rem',
          }}
          aria-hidden
        >
          <Shield size={20} />
        </span>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '0.625rem',
            letterSpacing: '-0.025em',
          }}
        >
          Unauthorized
        </h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Admin only — connect with the deployer wallet to access these controls.
        </p>
        <p
          style={{
            padding: '0.625rem 0.875rem',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            wordBreak: 'break-all',
            textAlign: 'left',
          }}
        >
          {principal}
        </p>
      </div>
    );
  }

  /* ── Admin view ── */
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Page Header */}
      <div
        style={{
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            <p className="label-meta">Admin</p>
            <span
              className="badge"
              style={{
                background: 'var(--success-dim)',
                color: 'var(--success)',
                border: '1px solid var(--success-border)',
              }}
            >
              Deployer Access
            </span>
          </div>
          <h1
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '0.375rem',
            }}
          >
            Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Deployer-gated controls for floor sweeps, relisting, and token burns.
          </p>
        </div>
      </div>

      {/* Tx Status Banner */}
      {txStatus !== 'idle' && (
        <div
          className="status-banner"
          style={{
            marginBottom: '1.5rem',
            ...(txStatus === 'success'
              ? { background: 'var(--success-dim)',     borderColor: 'var(--success-border)',     color: 'var(--success)'     }
              : txStatus === 'error'
              ? { background: 'var(--destructive-dim)', borderColor: 'var(--destructive-border)', color: 'var(--destructive)' }
              : { background: 'var(--accent-dim)',      borderColor: 'var(--accent-border)',      color: 'var(--accent)'      }),
          }}
          role="status"
          aria-live="polite"
        >
          {txStatus === 'success' ? (
            <CheckCircle size={14} aria-hidden />
          ) : txStatus === 'error' ? (
            <XCircle size={14} aria-hidden />
          ) : (
            <Loader2 size={14} aria-hidden style={{ animation: 'spin 1s linear infinite' }} />
          )}
          <span style={{ fontSize: '0.8rem' }}>
            {txStatus === 'success' && txId ? (
              <>
                Transaction submitted.{' '}
                <a
                  href={explorerTxLink(txId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'underline' }}
                >
                  View on Explorer <ExternalLink size={10} />
                </a>
              </>
            ) : txStatus === 'error'
              ? 'Transaction failed. Please try again.'
              : 'Transaction pending — approve in your wallet…'
            }
          </span>
        </div>
      )}

      {/* Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* ── Floor Sweep ── */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span
              aria-hidden
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
              }}
            >
              <ShoppingBag size={14} />
            </span>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
                Floor Sweep
              </h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                Sweep an NFT and relist at premium
              </p>
            </div>
          </div>

          <form
            onSubmit={handleFloorSweep}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div>
              <label
                htmlFor="sweep-token-id"
                className="label-meta"
                style={{ display: 'block', marginBottom: '0.375rem' }}
              >
                Token ID
              </label>
              <input
                id="sweep-token-id"
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
              <label
                htmlFor="sweep-contract"
                className="label-meta"
                style={{ display: 'block', marginBottom: '0.375rem' }}
              >
                NFT Contract
              </label>
              <input
                id="sweep-contract"
                className="input-field"
                type="text"
                value={`${NFT_MARKETPLACE_ADDRESS}.nft-marketplace`}
                readOnly
                style={{
                  opacity: 0.55,
                  cursor: 'not-allowed',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !sweepTokenId}
              style={{ marginTop: '0.25rem' }}
            >
              {isLoading
                ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                : <ShoppingBag size={13} />
              }
              Execute Floor Sweep
            </button>
          </form>
        </div>

        {/* ── Burn FLYRA ── */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {/* Burn header with big counter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--destructive-dim)',
                  border: '1px solid var(--destructive-border)',
                  color: 'var(--destructive)',
                }}
              >
                <Flame size={14} />
              </span>
              <div>
                <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
                  Burn FLYRA
                </h2>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                  Permanently reduce circulating supply
                </p>
              </div>
            </div>

            {/* Prominent burn preview */}
            {burnAmount ? (
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--destructive-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <p className="label-meta" style={{ marginBottom: '0.375rem' }}>To be destroyed</p>
                <p
                  className="mono-data"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--destructive)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  {formatFLYRA(parseFloat(burnAmount) * FLYRA_DECIMALS)}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  FLYRA ({(parseFloat(burnAmount) * FLYRA_DECIMALS).toLocaleString()} uFLYRA)
                </p>
              </div>
            ) : (
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <p className="label-meta" style={{ marginBottom: '0.375rem' }}>To be destroyed</p>
                <p
                  className="mono-data"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  —
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  Enter an amount below
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleBurn}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
          >
            <div>
              <label
                htmlFor="burn-amount"
                className="label-meta"
                style={{ display: 'block', marginBottom: '0.375rem' }}
              >
                Amount (FLYRA)
              </label>
              <input
                id="burn-amount"
                className="input-field"
                type="number"
                min="0.000001"
                step="any"
                placeholder="e.g. 1000.00"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                required
              />
            </div>

            {/* Irreversible warning */}
            <div
              style={{
                padding: '0.625rem 0.75rem',
                background: 'var(--destructive-dim)',
                border: '1px solid var(--destructive-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.72rem',
                color: 'var(--destructive)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
              }}
            >
              <XCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden />
              Burns are irreversible. Tokens will be permanently destroyed.
            </div>

            <button
              type="submit"
              className="btn-danger"
              disabled={isLoading || !burnAmount}
            >
              {isLoading
                ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                : <Flame size={13} />
              }
              Burn Tokens
            </button>
          </form>
        </div>

        {/* ── Premium Relist Info ── */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span
              aria-hidden
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-dim)',
                border: '1px solid var(--success-border)',
                color: 'var(--success)',
              }}
            >
              <RefreshCw size={14} />
            </span>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
                Premium Relist
              </h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                Auto-relisting via sweep-and-relist
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}
          >
            The{' '}
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--success)',
                background: 'var(--success-dim)',
                padding: '0.1rem 0.3rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--success-border)',
              }}
            >
              sweep-and-relist
            </code>{' '}
            function in the strategy token contract automatically handles floor sweeping and premium
            relisting in a single atomic transaction.
          </p>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Use the <strong style={{ color: 'var(--foreground)', fontWeight: 600 }}>Floor Sweep</strong> action
            above to trigger this flow — the contract handles the relist logic internally.
          </p>

          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}
          >
            (define-public (sweep-and-relist<br />
            &nbsp;&nbsp;(nft-contract &lt;nft-trait&gt;)<br />
            &nbsp;&nbsp;(token-id uint)))
          </div>
        </div>
      </div>
    </div>
  );
}
