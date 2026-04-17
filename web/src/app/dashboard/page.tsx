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
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.875rem',
        fontSize: '0.78rem',
      }}
    >
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', letterSpacing: '0.04em', fontSize: '0.68rem', textTransform: 'uppercase' }}>{label}</p>
      <p className="mono-data" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
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
      value: stats ? `${formatSTX(stats.floorPrice)}` : '—',
      unit: 'STX',
      icon: TrendingUp,
      color: 'var(--accent)',
      sub: 'Current floor listing',
    },
    {
      label: 'Total Listings',
      value: stats?.totalListings ?? '—',
      unit: '',
      icon: Layers,
      color: '#60A5FA',
      sub: 'Active on-chain listings',
    },
    {
      label: 'Total Volume',
      value: stats ? `${formatCompact(stats.totalVolume / STX_DECIMALS)}` : '—',
      unit: 'STX',
      icon: ShoppingBag,
      color: '#A78BFA',
      sub: 'All-time traded volume',
    },
    {
      label: 'FLYRA Burned',
      value: stats ? `${formatCompact(stats.totalBurned / 1_000_000)}` : '—',
      unit: 'FLYRA',
      icon: Flame,
      color: 'var(--destructive)',
      sub: 'Deflationary burns',
    },
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
          Strategy Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Real-time protocol metrics, floor price trends, and burn analytics.
        </p>
      </div>

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
        {KPI_CARDS.map(({ label, value, unit, icon: Icon, color, sub }) => (
          <div
            key={label}
            style={{ padding: '1.5rem 1.25rem', background: 'var(--bg-surface)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.875rem',
              }}
            >
              <p className="label-meta">{label}</p>
              <span
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-md)',
                  background: `${color}18`,
                  border: `1px solid ${color}28`,
                  color,
                  flexShrink: 0,
                }}
              >
                <Icon size={13} />
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <p
                className="mono-data"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--foreground)',
                  lineHeight: 1,
                }}
              >
                {statsLoading ? '—' : value}
              </p>
              {unit && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {unit}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* Floor Price Chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} aria-hidden />
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
                Floor Price
              </h2>
            </div>
            <span
              className="badge"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
            >
              30d
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--accent)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v} STX`} />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--accent)"
                strokeWidth={1.5}
                fill="url(#floorGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Burn History */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={14} style={{ color: 'var(--destructive)' }} aria-hidden />
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
                FLYRA Burns
              </h2>
            </div>
            <span
              className="badge"
              style={{ background: 'var(--destructive-dim)', color: 'var(--destructive)', border: '1px solid var(--destructive-border)' }}
            >
              14d
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={burns} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip formatter={(v) => `${formatFLYRA(v)} FLYRA`} />} />
              <Bar
                dataKey="amount"
                fill="var(--destructive)"
                radius={[2, 2, 0, 0]}
                opacity={0.75}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Token Supply Breakdown */}
      {stats && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BarChart2 size={14} style={{ color: 'var(--text-muted)' }} aria-hidden />
            <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
              FLYRA Token Supply
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {[
              { label: 'Total Supply',  value: formatFLYRA(stats.flyraSupply),                     color: 'var(--foreground)'   },
              { label: 'Total Burned',  value: formatFLYRA(stats.totalBurned),                      color: 'var(--destructive)'  },
              { label: 'Circulating',   value: formatFLYRA(stats.flyraSupply - stats.totalBurned),  color: 'var(--success)'      },
              { label: 'Burn Rate',     value: `${((stats.totalBurned / stats.flyraSupply) * 100).toFixed(2)}%`, color: 'var(--warning)' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="label-meta" style={{ marginBottom: '0.375rem' }}>{label}</p>
                <p
                  className="mono-data"
                  style={{ fontSize: '1.25rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div
              style={{
                height: '3px',
                background: 'var(--bg-elevated)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((stats.totalBurned / stats.flyraSupply) * 100).toFixed(2)}%`,
                  background: 'var(--destructive)',
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.5rem', letterSpacing: '0.03em' }}>
              Burned supply as percentage of total issuance
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
