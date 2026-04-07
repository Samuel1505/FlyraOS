'use client';

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
} from 'recharts';
import {
  TrendingUp,
  Flame,
  ShoppingBag,
  Layers,
  BarChart2,
} from 'lucide-react';
import { useProtocolStats, useFloorPriceHistory, useBurnHistory } from '@/hooks/useNFTData';
import { formatSTX, formatFLYRA, formatCompact, formatDate } from '@/lib/utils';
import { STX_DECIMALS } from '@/config';

const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  formatter?: (v: number) => string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: '6px',
        padding: '0.5rem 0.875rem',
        fontSize: '0.8rem',
      }}
    >
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</p>
      <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>
        {formatter ? formatter(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
};

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useProtocolStats();
  const { history } = useFloorPriceHistory();
  const { burns } = useBurnHistory();

  const KPI_CARDS = [
    {
      label: 'Floor Price',
      value: stats ? `${formatSTX(stats.floorPrice)} STX` : '—',
      icon: TrendingUp,
      color: 'var(--primary)',
      sub: 'Current floor listing',
    },
    {
      label: 'Total Listings',
      value: stats?.totalListings ?? '—',
      icon: Layers,
      color: 'var(--accent)',
      sub: 'Active on-chain listings',
    },
    {
      label: 'Total Volume',
      value: stats ? `${formatCompact(stats.totalVolume / STX_DECIMALS)} STX` : '—',
      icon: ShoppingBag,
      color: '#8b5cf6',
      sub: 'All-time traded volume',
    },
    {
      label: 'FLYRA Burned',
      value: stats ? `${formatCompact(stats.totalBurned / 1_000_000)} FLYRA` : '—',
      icon: Flame,
      color: 'var(--destructive)',
      sub: 'Deflationary burns',
    },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="label-meta" style={{ marginBottom: '0.4rem' }}>Protocol</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          Strategy Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time protocol metrics, floor price trends, and burn analytics.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {KPI_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card" style={{ padding: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div>
                <p className="label-meta" style={{ marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
                  {statsLoading ? '…' : value}
                </p>
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                <Icon size={16} />
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
        {/* Floor Price Chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={15} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Floor Price (30d)</h2>
            <span className="badge" style={{ marginLeft: 'auto', background: 'var(--primary-dim)', color: '#60a5fa' }}>
              STX
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                interval={6}
              />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v} STX`} />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#floorGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Burn History */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Flame size={15} style={{ color: 'var(--destructive)' }} />
            <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>FLYRA Burns (14d)</h2>
            <span className="badge" style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.12)', color: 'var(--destructive)' }}>
              FLYRA
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={burns} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${formatFLYRA(v)} FLYRA`} />} />
              <Bar dataKey="amount" fill="var(--destructive)" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supply Breakdown */}
      {stats && (
        <div className="card" style={{ padding: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart2 size={15} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>FLYRA Token Supply</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {[
              { label: 'Total Supply', value: formatFLYRA(stats.flyraSupply), color: 'var(--foreground)' },
              { label: 'Total Burned', value: formatFLYRA(stats.totalBurned), color: 'var(--destructive)' },
              {
                label: 'Circulating',
                value: formatFLYRA(stats.flyraSupply - stats.totalBurned),
                color: 'var(--accent)',
              },
              {
                label: 'Burn Rate',
                value: `${((stats.totalBurned / stats.flyraSupply) * 100).toFixed(2)}%`,
                color: 'var(--warning)',
              },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="label-meta" style={{ marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{value}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                height: '6px',
                background: 'var(--bg-elevated)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((stats.totalBurned / stats.flyraSupply) * 100).toFixed(2)}%`,
                  background: 'linear-gradient(90deg, var(--destructive), var(--warning))',
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Burned supply as percentage of total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
