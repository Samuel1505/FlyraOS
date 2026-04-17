'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  Droplets,
  ArrowLeftRight,
  TrendingUp,
  Info,
  Percent,
} from 'lucide-react';
import { getPoolDetails } from '@/lib/contracts/pool';
import { calcTokensOut, calcSTXOut } from '@/lib/contracts/pool';
import { formatSTX, formatFLYRA } from '@/lib/utils';
import { STX_DECIMALS, FLYRA_DECIMALS } from '@/config';

export default function LiquidityPage() {
  const { data: pool, isLoading } = useSWR('pool-details', getPoolDetails, {
    refreshInterval: 30_000,
  });

  const [stxInput,   setStxInput]   = useState('');
  const [flyraInput, setFlyraInput] = useState('');

  const stxReserve   = pool?.stxBalance   ?? 0;
  const flyraReserve = pool?.tokenBalance ?? 0;

  const tokensOut =
    stxInput && stxReserve > 0
      ? calcTokensOut(parseFloat(stxInput) * STX_DECIMALS, stxReserve, flyraReserve)
      : 0;

  const stxOut =
    flyraInput && flyraReserve > 0
      ? calcSTXOut(parseFloat(flyraInput) * FLYRA_DECIMALS, stxReserve, flyraReserve)
      : 0;

  const spotPrice =
    stxReserve > 0 && flyraReserve > 0
      ? (flyraReserve / STX_DECIMALS) / (stxReserve / STX_DECIMALS)
      : 0;

  const feeRate = pool?.feeRate ?? 3;

  const POOL_METRICS = [
    { label: 'STX Reserve',   value: pool ? `${formatSTX(stxReserve)} STX`         : '—', icon: Droplets,      color: '#60A5FA' },
    { label: 'FLYRA Reserve', value: pool ? `${formatFLYRA(flyraReserve)} FLYRA`    : '—', icon: TrendingUp,    color: 'var(--success)'  },
    { label: 'Fee Rate',      value: pool ? `${feeRate / 10}%`                      : '—', icon: Percent,       color: 'var(--warning)'  },
    { label: 'Spot Price',    value: pool ? `${spotPrice.toFixed(2)} FLYRA / STX`   : '—', icon: ArrowLeftRight, color: 'var(--accent)'   },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Page Header */}
      <div
        style={{
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <p className="label-meta" style={{ marginBottom: '0.375rem' }}>Protocol</p>
        <h1
          style={{
            fontSize: '1.625rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: '0.375rem',
          }}
        >
          Liquidity Pool
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          STX/FLYRA XYK pool — track reserves, swap price, and fee performance.
        </p>
      </div>

      {/* Pool Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1px',
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {POOL_METRICS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{ padding: '1.25rem', background: 'var(--bg-surface)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <p className="label-meta">{label}</p>
              <span
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius-md)',
                  background: `${color}18`,
                  border: `1px solid ${color}28`,
                  color,
                }}
              >
                <Icon size={12} />
              </span>
            </div>
            <p
              className="mono-data"
              style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.02em' }}
            >
              {isLoading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {/* Calculators */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* STX → FLYRA */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '-0.015em',
            }}
          >
            <ArrowLeftRight size={13} style={{ color: 'var(--accent)' }} aria-hidden />
            STX → FLYRA Calculator
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="stx-input"
              className="label-meta"
              style={{ display: 'block', marginBottom: '0.375rem' }}
            >
              STX to swap
            </label>
            <input
              id="stx-input"
              className="input-field"
              type="number"
              min="0"
              placeholder="0.00"
              value={stxInput}
              onChange={(e) => setStxInput(e.target.value)}
            />
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--bg-inset)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.875rem',
            }}
          >
            <p className="label-meta" style={{ marginBottom: '0.375rem' }}>Estimated FLYRA out</p>
            <p
              className="mono-data"
              style={{
                fontSize: '1.375rem',
                fontWeight: 700,
                color: stxInput ? 'var(--success)' : 'var(--text-muted)',
                letterSpacing: '-0.025em',
              }}
            >
              {stxInput ? `${formatFLYRA(tokensOut)} FLYRA` : '—'}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.375rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <Info size={11} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden />
            Excludes {feeRate / 10}% swap fee. XYK constant product formula.
          </div>
        </div>

        {/* FLYRA → STX */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '-0.015em',
            }}
          >
            <ArrowLeftRight size={13} style={{ color: '#60A5FA' }} aria-hidden />
            FLYRA → STX Calculator
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="flyra-input"
              className="label-meta"
              style={{ display: 'block', marginBottom: '0.375rem' }}
            >
              FLYRA to swap
            </label>
            <input
              id="flyra-input"
              className="input-field"
              type="number"
              min="0"
              placeholder="0.00"
              value={flyraInput}
              onChange={(e) => setFlyraInput(e.target.value)}
            />
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--bg-inset)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.875rem',
            }}
          >
            <p className="label-meta" style={{ marginBottom: '0.375rem' }}>Estimated STX out</p>
            <p
              className="mono-data"
              style={{
                fontSize: '1.375rem',
                fontWeight: 700,
                color: flyraInput ? '#60A5FA' : 'var(--text-muted)',
                letterSpacing: '-0.025em',
              }}
            >
              {flyraInput ? `${formatSTX(stxOut)} STX` : '—'}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.375rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <Info size={11} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden />
            Excludes {feeRate / 10}% swap fee. XYK constant product formula.
          </div>
        </div>
      </div>

      {/* Pool Details */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2
          style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            letterSpacing: '-0.015em',
          }}
        >
          Pool Details
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[
            { label: 'Pool Type',         value: 'XYK Constant Product',            mono: false },
            { label: 'Fee Rate',          value: pool ? `${feeRate / 10}%` : '—',   mono: false },
            { label: 'Fee Distribution',  value: 'Strategy Token Contract',         mono: false },
            { label: 'Token Pair',        value: 'STX / FLYRA',                     mono: false },
            { label: 'STX Address',       value: 'Native',                          mono: false },
            { label: 'Contract',          value: 'liquidity-pool.clar',             mono: true  },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <p className="label-meta" style={{ marginBottom: '0.375rem' }}>{label}</p>
              <p
                style={{
                  color: 'var(--foreground)',
                  fontSize: mono ? '0.75rem' : '0.875rem',
                  fontFamily: mono ? 'var(--font-mono)' : undefined,
                  fontWeight: 500,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
