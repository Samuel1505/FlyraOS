'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Layers,
  TrendingUp,
  ShoppingBag,
  Flame,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useProtocolStats, useFloorPriceHistory } from '@/hooks/useNFTData';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/lib/context/WalletContext';
import { formatSTX, formatCompact, formatDate, explorerTxLink } from '@/lib/utils';
import { STX_DECIMALS, FLYRA_DECIMALS } from '@/config';

/* ─── Types ───────────────────────────────────── */
type HoldingStatus = 'Listed' | 'Held' | 'Sold';

interface Holding {
  collection: string;
  tokenId: number;
  image: string;
  acquired: number;    // STX
  currentFloor: number; // STX
  relistPrice: number;  // STX
  status: HoldingStatus;
}

/* ─── Mock Data ───────────────────────────────── */
const MOCK_HOLDINGS: Holding[] = [
  { collection: 'CrashPunks',      tokenId: 4201, image: 'https://picsum.photos/seed/cp4201/48/48',   acquired: 20,  currentFloor: 22,  relistPrice: 28,  status: 'Listed' },
  { collection: 'StacksPunks',     tokenId: 1337, image: 'https://picsum.photos/seed/sp1337/48/48',   acquired: 42,  currentFloor: 45,  relistPrice: 58,  status: 'Held'   },
  { collection: 'Megapont Ape',    tokenId: 891,  image: 'https://picsum.photos/seed/ma891/48/48',    acquired: 118, currentFloor: 125, relistPrice: 152, status: 'Sold'   },
  { collection: 'CrashPunks',      tokenId: 4205, image: 'https://picsum.photos/seed/cp4205/48/48',   acquired: 21,  currentFloor: 22,  relistPrice: 27,  status: 'Listed' },
  { collection: 'Bitcoin Monkeys', tokenId: 2211, image: 'https://picsum.photos/seed/bm2211/48/48',   acquired: 82,  currentFloor: 85,  relistPrice: 105, status: 'Held'   },
  { collection: 'Stacks Parrots',  tokenId: 734,  image: 'https://picsum.photos/seed/sparr734/48/48', acquired: 33,  currentFloor: 35,  relistPrice: 44,  status: 'Sold'   },
  { collection: 'Bitcoin Monkeys', tokenId: 887,  image: 'https://picsum.photos/seed/bm887/48/48',    acquired: 80,  currentFloor: 85,  relistPrice: 102, status: 'Listed' },
];

const REVENUE_DATA = [
  { month: 'Nov', sweepFees: 120, relistMargin: 340, penalty: 60 },
  { month: 'Dec', sweepFees: 155, relistMargin: 410, penalty: 45 },
  { month: 'Jan', sweepFees: 140, relistMargin: 380, penalty: 80 },
  { month: 'Feb', sweepFees: 210, relistMargin: 550, penalty: 100 },
  { month: 'Mar', sweepFees: 190, relistMargin: 475, penalty: 70 },
  { month: 'Apr', sweepFees: 255, relistMargin: 670, penalty: 140 },
];

const STATUS_STYLE: Record<HoldingStatus, { bg: string; border: string; color: string }> = {
  Listed: { bg: 'var(--accent-dim)',      border: 'var(--accent-border)',      color: 'var(--accent)'      },
  Held:   { bg: 'var(--warning-dim)',     border: 'var(--warning-border)',     color: 'var(--warning)'     },
  Sold:   { bg: 'var(--success-dim)',     border: 'var(--success-border)',     color: 'var(--success)'     },
};

const CustomTooltip = ({
  active, payload, label, formatter,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  formatter?: (v: number) => string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem', fontSize: '0.78rem' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.375rem', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="mono-data" style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function TreasuryPage() {
  const { stats, isLoading: statsLoading } = useProtocolStats();
  const { history }                        = useFloorPriceHistory();
  const { floorSweep, isLoading: txLoading, txStatus, txId } = useContract();
  const { isConnected }                    = useWallet();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [markup, setMarkup]           = useState('30');
  const [expiry, setExpiry]           = useState('7d');

  const totalRevenue = REVENUE_DATA.reduce(
    (acc, d) => acc + d.sweepFees + d.relistMargin + d.penalty,
    0,
  );
  const soldHoldings   = MOCK_HOLDINGS.filter((h) => h.status === 'Sold');
  const totalProfit    = soldHoldings.reduce((acc, h) => acc + (h.relistPrice - h.acquired), 0);
  const nftCount       = MOCK_HOLDINGS.filter((h) => h.status !== 'Sold').length;

  function toggleSelect(tokenId: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(tokenId)) next.delete(tokenId);
      else next.add(tokenId);
      return next;
    });
  }

  async function handleRelist(tokenId?: number) {
    if (!isConnected) return;
    const targets = tokenId
      ? MOCK_HOLDINGS.filter((h) => h.tokenId === tokenId)
      : MOCK_HOLDINGS.filter((h) => selectedIds.has(h.tokenId) && h.status !== 'Sold');
    if (!targets.length) return;
    try {
      for (const h of targets) {
        await floorSweep('SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.nft-marketplace', h.tokenId);
      }
    } catch { /* handled by hook */ }
  }

  const KPI_CARDS = [
    {
      label: 'Treasury Value',
      value: stats ? `${formatSTX(stats.totalVolume)} STX` : '—',
      icon: TrendingUp, color: 'var(--accent)', sub: 'Est. total asset value',
    },
    {
      label: 'NFTs Held',
      value: String(nftCount),
      icon: Layers, color: '#60A5FA', sub: 'Active portfolio positions',
    },
    {
      label: 'Active Listings',
      value: String(MOCK_HOLDINGS.filter((h) => h.status === 'Listed').length),
      icon: ShoppingBag, color: 'var(--success)', sub: 'On-chain relist listings',
    },
    {
      label: 'FLYRA Burned',
      value: stats ? formatCompact(stats.totalBurned / FLYRA_DECIMALS) : '—',
      icon: Flame, color: 'var(--destructive)', sub: 'Permanent supply reduction',
    },
  ];

  const lastUpdated = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Page Header */}
      <div
        style={{
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p className="label-meta" style={{ marginBottom: '0.375rem' }}>Protocol</p>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
            Treasury Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Portfolio holdings, revenue analytics, and auto-relist management.
          </p>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Updated {lastUpdated}
        </p>
      </div>

      {/* Tx Status */}
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
          {txStatus === 'success' ? <CheckCircle size={14} /> :
           txStatus === 'error'   ? <Flame size={14} />       :
           <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
          <span style={{ fontSize: '0.8rem' }}>
            {txStatus === 'success' && txId
              ? <><a href={explorerTxLink(txId)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>Relist submitted — view on Explorer <ExternalLink size={10} /></a></>
              : txStatus === 'error' ? 'Relist failed.' : 'Relisting — approve in wallet…'}
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1px',
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {KPI_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} style={{ padding: '1.5rem 1.25rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <p className="label-meta">{label}</p>
              <span aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: `${color}18`, border: `1px solid ${color}28`, color, flexShrink: 0 }}>
                <Icon size={13} />
              </span>
            </div>
            <p className="mono-data" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {statsLoading ? '—' : value}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Floor Price / TVL Chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} aria-hidden />
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>Floor Price History</h2>
            </div>
            <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>30d</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--accent)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate}
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false} interval={7} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v} STX`} />} />
              <Area type="monotone" dataKey="price" name="Floor" stroke="var(--accent)" strokeWidth={1.5} fill="url(#tvlGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={14} style={{ color: 'var(--success)' }} aria-hidden />
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>Protocol Revenue</h2>
            </div>
            <span className="badge" style={{ background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>6mo</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v} STX`} />} />
              <Bar dataKey="relistMargin" name="Relist Margin" fill="var(--success)"     radius={[2,2,0,0]} opacity={0.80} stackId="r" maxBarSize={32} />
              <Bar dataKey="sweepFees"   name="Sweep Fees"   fill="var(--accent)"       radius={[2,2,0,0]} opacity={0.70} stackId="r" maxBarSize={32} />
              <Bar dataKey="penalty"     name="Penalty"      fill="var(--warning)"      radius={[2,2,0,0]} opacity={0.65} stackId="r" maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1px',
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: 'Total Revenue',  value: `${totalRevenue} STX`,  color: 'var(--success)'     },
          { label: 'Relist Revenue', value: `${REVENUE_DATA.reduce((a,d)=>a+d.relistMargin,0)} STX`, color: 'var(--accent)'  },
          { label: 'NFTs Sold',      value: String(soldHoldings.length),  color: 'var(--foreground)' },
          { label: 'Avg. Profit',    value: soldHoldings.length ? `${(totalProfit / soldHoldings.length).toFixed(1)} STX` : '—', color: 'var(--success)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: '1.25rem', background: 'var(--bg-surface)' }}>
            <p className="label-meta" style={{ marginBottom: '0.5rem' }}>{label}</p>
            <p className="mono-data" style={{ fontSize: '1.25rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Auto-Relist Manager */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={14} style={{ color: 'var(--success)' }} aria-hidden />
              Auto-Relist Manager
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select NFTs to batch relist'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Markup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label className="label-meta" style={{ whiteSpace: 'nowrap' }}>Markup %</label>
              <input className="input-field" type="number" min="5" max="200" value={markup}
                onChange={(e) => setMarkup(e.target.value)}
                style={{ width: '72px' }} />
            </div>
            {/* Expiry */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label className="label-meta">Expiry</label>
              <select className="input-field" value={expiry} onChange={(e) => setExpiry(e.target.value)} style={{ width: 'auto' }}>
                {['1d','3d','7d','14d','30d'].map((v) => (
                  <option key={v} value={v} style={{ background: 'var(--bg-elevated)' }}>{v}</option>
                ))}
              </select>
            </div>
            <button className="btn-outline" onClick={() => handleRelist()}
              disabled={selectedIds.size === 0 || txLoading}
              style={{ fontSize: '0.8rem' }}>
              {txLoading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
              Relist Selected
            </button>
            <button className="btn-primary" onClick={() => handleRelist()}
              disabled={!isConnected || txLoading}
              style={{ fontSize: '0.8rem' }}>
              {txLoading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
              Auto-Relist All
            </button>
          </div>
        </div>

        {/* Holdings Table */}
        <div>
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 52px 1fr auto auto auto auto auto',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              alignItems: 'center',
            }}
          >
            <span />
            <span />
            {['Collection', 'Acquired', 'Floor', 'Relist Price', 'Profit', 'Status'].map((h) => (
              <span key={h} className="label-meta">{h}</span>
            ))}
            <span />
          </div>

          {MOCK_HOLDINGS.map((h) => {
            const s = STATUS_STYLE[h.status];
            const profit = h.relistPrice - h.acquired;
            const profitPct = ((profit / h.acquired) * 100).toFixed(1);
            const isSelected = selectedIds.has(h.tokenId);
            return (
              <div
                key={`${h.collection}-${h.tokenId}`}
                className="data-table-row"
                style={{
                  gridTemplateColumns: '24px 52px 1fr auto auto auto auto auto',
                  gap: '0.625rem',
                  alignItems: 'center',
                  background: isSelected ? 'rgba(99,102,241,0.04)' : undefined,
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(h.tokenId)}
                  disabled={h.status === 'Sold'}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                  aria-label={`Select ${h.collection} #${h.tokenId}`}
                />
                {/* Image */}
                <img src={h.image} alt={`${h.collection} #${h.tokenId}`}
                  width={40} height={40}
                  style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', objectFit: 'cover', display: 'block' }} />
                {/* Name */}
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 500 }}>{h.collection}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>#{h.tokenId}</p>
                </div>
                <span className="mono-data" style={{ fontSize: '0.78rem' }}>{h.acquired} STX</span>
                <span className="mono-data" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{h.currentFloor} STX</span>
                <span className="mono-data" style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>{h.relistPrice} STX</span>
                {/* Profit */}
                <span
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.2rem',
                    fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
                    color: profit >= 0 ? 'var(--success)' : 'var(--destructive)',
                  }}
                >
                  {profit >= 0 ? <ArrowUpRight size={12} aria-hidden /> : <ArrowDownRight size={12} aria-hidden />}
                  +{profitPct}%
                </span>
                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{h.status}</span>
                  {h.status !== 'Sold' && (
                    <button
                      onClick={() => handleRelist(h.tokenId)}
                      disabled={!isConnected || txLoading}
                      title="Relist this NFT"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '24px', height: '24px',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer',
                        transition: 'color 0.12s, border-color 0.12s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--success)'; e.currentTarget.style.borderColor = 'var(--success-border)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                    >
                      <RefreshCw size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
