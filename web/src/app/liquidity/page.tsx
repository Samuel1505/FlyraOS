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

  const [stxInput, setStxInput] = useState('');
  const [flyraInput, setFlyraInput] = useState('');

  const stxReserve = pool?.stxBalance ?? 0;
  const flyraReserve = pool?.tokenBalance ?? 0;

  const tokensOut =
    stxInput && stxReserve > 0
      ? calcTokensOut(
          parseFloat(stxInput) * STX_DECIMALS,
          stxReserve,
          flyraReserve,
        )
      : 0;

  const stxOut =
    flyraInput && flyraReserve > 0
      ? calcSTXOut(
          parseFloat(flyraInput) * FLYRA_DECIMALS,
          stxReserve,
          flyraReserve,
        )
      : 0;

  const spotPrice =
    stxReserve > 0 && flyraReserve > 0
      ? (flyraReserve / STX_DECIMALS) / (stxReserve / STX_DECIMALS)
      : 0;

  const feeRate = pool?.feeRate ?? 3;

  const POOL_METRICS = [
    {
      label: 'STX Reserve',
      value: pool ? `${formatSTX(stxReserve)} STX` : '—',
      icon: Droplets,
      color: '#3b82f6',
    },
    {
      label: 'FLYRA Reserve',
      value: pool ? `${formatFLYRA(flyraReserve)} FLYRA` : '—',
      icon: TrendingUp,
      color: 'var(--accent)',
    },
    {
      label: 'Fee Rate',
      value: pool ? `${feeRate / 10}%` : '—',
      icon: Percent,
      color: 'var(--warning)',
    },
    {
      label: 'Spot Price',
      value: pool ? `${spotPrice.toFixed(2)} FLYRA / STX` : '—',
      icon: ArrowLeftRight,
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="label-meta" style={{ marginBottom: '0.4rem' }}>Protocol</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          Liquidity Pool
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          STX/FLYRA XYK pool — track reserves, swap price, and fee performance.
        </p>
      </div>

      {/* Pool Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {POOL_METRICS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p className="label-meta">{label}</p>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                <Icon size={13} />
              </span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
              {isLoading ? '…' : value}
            </p>
          </div>
        ))}
      </div>

      {/* Calculators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
        {/* STX → FLYRA */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ArrowLeftRight size={14} style={{ color: 'var(--primary)' }} />
            STX → FLYRA Calculator
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <label className="label-meta" style={{ display: 'block', marginBottom: '0.4rem' }}>
              STX to swap
            </label>
            <input
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
              padding: '0.875rem',
              background: 'var(--bg-elevated)',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
            }}
          >
            <p className="label-meta" style={{ marginBottom: '0.25rem' }}>Estimated FLYRA out</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
              {stxInput
                ? `${formatFLYRA(tokensOut)} FLYRA`
                : '—'}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            <Info size={11} />
            Excludes {feeRate / 10}% swap fee. XYK constant product formula.
          </div>
        </div>

        {/* FLYRA → STX */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ArrowLeftRight size={14} style={{ color: 'var(--accent)' }} />
            FLYRA → STX Calculator
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <label className="label-meta" style={{ display: 'block', marginBottom: '0.4rem' }}>
              FLYRA to swap
            </label>
            <input
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
              padding: '0.875rem',
              background: 'var(--bg-elevated)',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
            }}
          >
            <p className="label-meta" style={{ marginBottom: '0.25rem' }}>Estimated STX out</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>
              {flyraInput ? `${formatSTX(stxOut)} STX` : '—'}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            <Info size={11} />
            Excludes {feeRate / 10}% swap fee. XYK constant product formula.
          </div>
        </div>
      </div>

      {/* Pool Info */}
      <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>
          Pool Details
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {[
            { label: 'Pool Type', value: 'XYK Constant Product' },
            { label: 'Fee Rate', value: pool ? `${feeRate / 10}%` : '—' },
            { label: 'Fee Distribution', value: 'Strategy Token Contract' },
            { label: 'Token Pair', value: 'STX / FLYRA' },
            { label: 'STX Address', value: 'Native' },
            { label: 'Contract', value: 'liquidity-pool.clar' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="label-meta" style={{ marginBottom: '0.25rem' }}>{label}</p>
              <p style={{ color: 'var(--foreground)', fontFamily: label === 'Contract' ? 'var(--font-mono)' : undefined, fontSize: label === 'Contract' ? '0.8rem' : undefined }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
