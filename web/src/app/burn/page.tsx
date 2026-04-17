'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Flame,
  TrendingDown,
  Trophy,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { useProtocolStats, useBurnHistory } from '@/hooks/useNFTData';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/lib/context/WalletContext';
import { formatFLYRA, formatCompact, formatDate, explorerTxLink, shortenAddress } from '@/lib/utils';
import { FLYRA_DECIMALS } from '@/config';

/* ─── Mock Leaderboard ────────────────────────── */
interface LeaderEntry {
  rank: number;
  address: string;
  burned: number; // uFLYRA
  bns?: string;
}

const MOCK_LEADERBOARD: LeaderEntry[] = [
  { rank: 1,  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ', burned: 1_250_000_000_000, bns: 'flyra.btc'  },
  { rank: 2,  address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE', burned: 980_000_000_000                      },
  { rank: 3,  address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE', burned: 875_000_000_000, bns: 'burner.btc' },
  { rank: 4,  address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS', burned: 640_000_000_000                      },
  { rank: 5,  address: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1', burned: 520_000_000_000, bns: 'whale.btc'  },
  { rank: 6,  address: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335', burned: 410_000_000_000                      },
  { rank: 7,  address: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C', burned: 380_000_000_000, bns: 'anon.btc'   },
  { rank: 8,  address: 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC', burned: 290_000_000_000                      },
  { rank: 9,  address: 'SP2R1V6RWBW7VT1N4AZMJNHGQKXMQ7GPKAM5WKDYK', burned: 240_000_000_000                      },
  { rank: 10, address: 'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ', burned: 180_000_000_000, bns: 'hodler.btc' },
];

const RANK_COLORS: Record<number, string> = {
  1: '#F59E0B',
  2: '#9898B0',
  3: '#CD7C2F',
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
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
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </p>
      <p className="mono-data" style={{ fontWeight: 600, color: 'var(--destructive)' }}>
        {formatCompact(payload[0].value / FLYRA_DECIMALS)} FLYRA
      </p>
    </div>
  );
};

export default function BurnPage() {
  const { stats, isLoading: statsLoading } = useProtocolStats();
  const { burns }                          = useBurnHistory();
  const { burnFLYRA, isLoading, txStatus, txId } = useContract();
  const { isConnected, connectWallet }     = useWallet();

  const [burnAmount, setBurnAmount]   = useState('');
  const [displayCount, setDisplayCount] = useState(0);

  /* Animate burn counter on load */
  useEffect(() => {
    if (!stats) return;
    const target = stats.totalBurned / FLYRA_DECIMALS;
    const duration = 2000;
    const start = performance.now();
    const update = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayCount(eased * target);
      if (p < 1) requestAnimationFrame(update);
      else setDisplayCount(target);
    };
    requestAnimationFrame(update);
  }, [stats]);

  const burnAmountNum = parseFloat(burnAmount) || 0;
  const burnAmountU   = burnAmountNum * FLYRA_DECIMALS;
  const supplyTotal   = stats ? stats.flyraSupply / FLYRA_DECIMALS : 0;
  const supplyBurned  = stats ? stats.totalBurned / FLYRA_DECIMALS : 0;
  const burnRate      = supplyTotal > 0 ? (supplyBurned / supplyTotal) * 100 : 0;
  const thisBurnPct   = supplyTotal > 0 ? (burnAmountNum / supplyTotal) * 100 : 0;

  /* Cumulative burn history for chart */
  const cumulativeBurns = burns.reduce<Array<{ date: string; cumulative: number }>>(
    (acc, b, i) => {
      const prev = i === 0 ? 0 : acc[i - 1].cumulative;
      return [...acc, { date: b.date, cumulative: prev + b.amount }];
    },
    [],
  );

  async function handleBurn(e: React.FormEvent) {
    e.preventDefault();
    if (!burnAmountNum) return;
    try {
      await burnFLYRA(burnAmountU);
      setBurnAmount('');
    } catch { /* handled by hook */ }
  }

  return (
    <div style={{ background: 'var(--background)' }}>

      {/* ── Burn Counter Hero ─────────────────────── */}
      <section
        style={{
          background: 'var(--bg-inset)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '3.5rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Counter */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                  background: 'var(--destructive-dim)', border: '1px solid var(--destructive-border)',
                  color: 'var(--destructive)',
                }}
                aria-hidden
              >
                <Flame size={15} />
              </span>
              <p className="label-meta">Total FLYRA Burned (All-Time)</p>
            </div>
            <p
              className="mono-data"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800,
                color: 'var(--destructive)',
                letterSpacing: '-0.05em',
                lineHeight: 1,
                marginBottom: '0.625rem',
              }}
              aria-live="polite"
            >
              {statsLoading ? '—' : Math.floor(displayCount).toLocaleString()}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              FLYRA tokens permanently destroyed
            </p>
          </div>

          {/* Impact Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1px',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {[
              { label: 'Burn Rate',      value: `${burnRate.toFixed(2)}%`,                         color: 'var(--destructive)' },
              { label: 'Circulating',    value: formatCompact(supplyTotal - supplyBurned),           color: 'var(--success)'     },
              { label: 'Total Supply',   value: formatCompact(supplyTotal),                          color: 'var(--foreground)'  },
              { label: '14d Burns',      value: formatCompact(burns.reduce((a,b)=>a+b.amount,0)/FLYRA_DECIMALS), color: 'var(--warning)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '1.125rem', background: 'var(--bg-surface)' }}>
                <p className="label-meta" style={{ marginBottom: '0.375rem' }}>{label}</p>
                <p className="mono-data" style={{ fontSize: '1.125rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
                  {statsLoading ? '—' : value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Supply progress bar */}
        {stats && (
          <div style={{ maxWidth: '1280px', margin: '2rem auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <p className="label-meta">Burned supply</p>
              <span className="mono-data" style={{ fontSize: '0.72rem', color: 'var(--destructive)' }}>
                {burnRate.toFixed(3)}% of total
              </span>
            </div>
            <div style={{ height: '3px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(burnRate, 100)}%`,
                  background: 'var(--destructive)',
                  borderRadius: '2px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        )}
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── Tx Status ── */}
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
            {txStatus === 'success' ? <CheckCircle size={14} aria-hidden /> :
             txStatus === 'error'   ? <XCircle size={14} aria-hidden />     :
             <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} aria-hidden />}
            <span style={{ fontSize: '0.8rem' }}>
              {txStatus === 'success' && txId ? (
                <>Burn submitted.{' '}
                  <a href={explorerTxLink(txId)} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    View on Explorer <ExternalLink size={10} />
                  </a></>
              ) : txStatus === 'error' ? 'Burn failed. Please try again.'
                : 'Burn transaction pending — approve in your wallet…'}
            </span>
          </div>
        )}

        {/* ── Burn Form + Impact ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Burn Form */}
          <form onSubmit={handleBurn}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2
                style={{
                  fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.015em',
                  marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <Flame size={14} style={{ color: 'var(--destructive)' }} aria-hidden />
                Burn FLYRA
              </h2>

              {/* Amount Input */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="burn-amount" className="label-meta" style={{ display: 'block', marginBottom: '0.375rem' }}>
                  Amount (FLYRA)
                </label>
                <input
                  id="burn-amount"
                  className="input-field"
                  type="number"
                  min="0.000001"
                  step="any"
                  placeholder="0.00"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  required
                />
              </div>

              {/* Preview */}
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--bg-inset)',
                  border: `1px solid ${burnAmount ? 'var(--destructive-border)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  marginBottom: '1rem',
                }}
              >
                <p className="label-meta" style={{ marginBottom: '0.375rem' }}>To be permanently destroyed</p>
                <p
                  className="mono-data"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: burnAmount ? 'var(--destructive)' : 'var(--text-muted)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  {burnAmount ? `${parseFloat(burnAmount).toLocaleString()}` : '—'}
                </p>
                {burnAmount && (
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                    FLYRA ({burnAmountU.toLocaleString()} uFLYRA)
                  </p>
                )}
              </div>

              {/* Info row */}
              <div style={{ display: 'flex', gap: '0.375rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
                <Info size={11} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden />
                Each burn reduces circulating supply permanently. Protocol revenue partially funds buyback-and-burn operations.
              </div>

              {/* Irreversible warning */}
              <div
                style={{
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                  padding: '0.625rem 0.75rem',
                  background: 'var(--destructive-dim)', border: '1px solid var(--destructive-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.72rem', color: 'var(--destructive)',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertTriangle size={11} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden />
                Burns are irreversible. Tokens will be permanently removed from circulation.
              </div>

              {isConnected ? (
                <button
                  type="submit"
                  className="btn-danger"
                  disabled={isLoading || !burnAmount}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
                >
                  {isLoading
                    ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Burning…</>
                    : <><Flame size={13} /> Burn FLYRA</>}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={connectWallet}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
                >
                  Connect Wallet to Burn
                </button>
              )}
            </div>
          </form>

          {/* Supply Impact */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2
              style={{
                fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.015em',
                marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              <TrendingDown size={14} style={{ color: 'var(--accent)' }} aria-hidden />
              Protocol Impact
            </h2>

            {stats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {
                    label: 'Current Burn Rate',
                    value: `${burnRate.toFixed(3)}%`,
                    color: 'var(--destructive)',
                    sub: 'of total FLYRA supply burned',
                  },
                  {
                    label: 'This Burn Adds',
                    value: burnAmount ? `+${thisBurnPct.toFixed(4)}%` : '—',
                    color: 'var(--warning)',
                    sub: 'additional supply reduction',
                  },
                  {
                    label: 'New Burn Rate',
                    value: burnAmount ? `${(burnRate + thisBurnPct).toFixed(3)}%` : '—',
                    color: 'var(--destructive)',
                    sub: 'after this burn',
                  },
                  {
                    label: 'Circulating After',
                    value: burnAmount
                      ? formatCompact(supplyTotal - supplyBurned - burnAmountNum)
                      : formatCompact(supplyTotal - supplyBurned),
                    color: 'var(--success)',
                    sub: 'FLYRA remaining in circulation',
                  },
                ].map(({ label, value, color, sub }) => (
                  <div
                    key={label}
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-inset)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <p className="label-meta" style={{ marginBottom: '0.375rem' }}>{label}</p>
                    <p className="mono-data" style={{ fontSize: '1.125rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
                      {value}
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{sub}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '76px', borderRadius: 'var(--radius-md)' }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Burn History Chart ── */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={14} style={{ color: 'var(--destructive)' }} aria-hidden />
              <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>Cumulative Burn History</h2>
            </div>
            <span
              className="badge"
              style={{ background: 'var(--destructive-dim)', color: 'var(--destructive)', border: '1px solid var(--destructive-border)' }}
            >
              14d
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cumulativeBurns} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--destructive)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false} interval={3}
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false}
                tickFormatter={(v: number) => formatCompact(v / FLYRA_DECIMALS)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="var(--destructive)"
                strokeWidth={1.5}
                fill="url(#burnGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Leaderboard ── */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Trophy size={14} style={{ color: 'var(--warning)' }} aria-hidden />
            <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
              Burn Leaderboard
            </h2>
          </div>

          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              gap: '0.75rem',
              padding: '0 0.75rem 0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            {['Rank', 'Wallet', 'Amount Burned'].map((h) => (
              <span key={h} className="label-meta">{h}</span>
            ))}
          </div>

          {MOCK_LEADERBOARD.map((entry) => {
            const rankColor = RANK_COLORS[entry.rank] ?? 'var(--text-muted)';
            return (
              <div
                key={entry.rank}
                className="data-table-row"
                style={{ gridTemplateColumns: '40px 1fr auto', gap: '0.75rem', alignItems: 'center' }}
              >
                {/* Rank */}
                <span
                  className="mono-data"
                  style={{
                    fontSize: entry.rank <= 3 ? '0.9rem' : '0.78rem',
                    fontWeight: 700,
                    color: rankColor,
                    textAlign: 'center',
                  }}
                >
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </span>

                {/* Wallet */}
                <div>
                  {entry.bns ? (
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}>
                      {entry.bns}
                    </p>
                  ) : null}
                  <p
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: entry.bns ? 'var(--text-muted)' : 'var(--text-secondary)',
                    }}
                  >
                    {shortenAddress(entry.address, 8)}
                  </p>
                </div>

                {/* Amount */}
                <span
                  className="mono-data"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: entry.rank <= 3 ? rankColor : 'var(--foreground)',
                  }}
                >
                  {formatCompact(entry.burned / FLYRA_DECIMALS)} FLYRA
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
