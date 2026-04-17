'use client';

import { useState, useMemo } from 'react';
import {
  Target,
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useWallet } from '@/lib/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import { explorerTxLink, shortenAddress } from '@/lib/utils';
import { STX_DECIMALS } from '@/config';

/* ─── Types ───────────────────────────────────── */
type SweepStatus = 'pending' | 'confirmed' | 'failed';

interface MockCollection {
  id: string;
  name: string;
  floor: number; // STX
  listed: number;
  contract: string;
}

interface QueueItem {
  id: string;
  collection: string;
  tokenId: number;
  pricePaid: number;
  total: number;
  status: SweepStatus;
  txId?: string;
  ts: Date;
}

/* ─── Mock Data ───────────────────────────────── */
const MOCK_COLLECTIONS: MockCollection[] = [
  { id: 'crashpunks',   name: 'CrashPunks',        floor: 22,  listed: 143, contract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.crashpunks-v2'        },
  { id: 'stackspunks',  name: 'StacksPunks',        floor: 45,  listed: 89,  contract: 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.stackspunks'           },
  { id: 'megapont',     name: 'Megapont Ape Club',  floor: 125, listed: 34,  contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-academy'   },
  { id: 'btcmonkeys',   name: 'Bitcoin Monkeys',    floor: 85,  listed: 67,  contract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys'        },
  { id: 'parrots',      name: 'Stacks Parrots',     floor: 35,  listed: 211, contract: 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.stacks-parrots'         },
  { id: 'friedchicken', name: 'Friedchicken NFT',   floor: 18,  listed: 320, contract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.friedchickennft'       },
];

const INITIAL_HISTORY: QueueItem[] = [
  {
    id: 'h1', collection: 'CrashPunks',       tokenId: 4201, pricePaid: 20, total: 20.5,
    status: 'confirmed', txId: '0x1a2b3c4d5e6f789a', ts: new Date(Date.now() - 3_600_000),
  },
  {
    id: 'h2', collection: 'StacksPunks',       tokenId: 1337, pricePaid: 43, total: 44.1,
    status: 'confirmed', txId: '0x2b3c4d5e6f7a8b9c', ts: new Date(Date.now() - 7_200_000),
  },
  {
    id: 'h3', collection: 'Bitcoin Monkeys',   tokenId: 891,  pricePaid: 82, total: 84.1,
    status: 'failed',    txId: '0x3c4d5e6f7a8b9c0d', ts: new Date(Date.now() - 14_400_000),
  },
];

const PROTOCOL_FEE_BPS = 50; // 0.5%

function formatTs(d: Date): string {
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_STYLE: Record<SweepStatus, { bg: string; border: string; color: string; label: string }> = {
  pending:   { bg: 'var(--accent-dim)',      border: 'var(--accent-border)',      color: 'var(--accent)',      label: 'Pending'   },
  confirmed: { bg: 'var(--success-dim)',     border: 'var(--success-border)',     color: 'var(--success)',     label: 'Confirmed' },
  failed:    { bg: 'var(--destructive-dim)', border: 'var(--destructive-border)', color: 'var(--destructive)', label: 'Failed'    },
};

export default function FloorSweepPage() {
  const { isConnected, connectWallet } = useWallet();
  const { floorSweep, isLoading, txStatus, txId } = useContract();

  const [selectedCollection, setSelectedCollection] = useState<MockCollection | null>(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [slippage, setSlippage] = useState('1.0');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [history] = useState<QueueItem[]>(INITIAL_HISTORY);

  const col = selectedCollection;
  const qty = Math.max(1, Math.min(20, parseInt(quantity) || 1));
  const maxPriceNum = parseFloat(maxPrice) || 0;
  const sweepCost = maxPriceNum * qty;
  const protocolFee = sweepCost * (PROTOCOL_FEE_BPS / 10_000);
  const totalCost = sweepCost + protocolFee;
  const isAboveFloor = col && maxPriceNum > col.floor;

  const canSweep = isConnected && col && maxPriceNum > 0 && qty > 0 && !isLoading;

  async function handleSweep(e: React.FormEvent) {
    e.preventDefault();
    if (!col || !canSweep) return;

    const newItem: QueueItem = {
      id: crypto.randomUUID(),
      collection: col.name,
      tokenId: Math.floor(Math.random() * 9000) + 1,
      pricePaid: maxPriceNum,
      total: totalCost,
      status: 'pending',
      ts: new Date(),
    };

    setQueue((prev) => [newItem, ...prev]);

    try {
      const id = await floorSweep(col.contract, newItem.tokenId);
      setQueue((prev) =>
        prev.map((item) =>
          item.id === newItem.id ? { ...item, status: 'confirmed', txId: id ?? undefined } : item,
        ),
      );
    } catch {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === newItem.id ? { ...item, status: 'failed' } : item,
        ),
      );
    }
  }

  const allHistory = useMemo(
    () => [...queue, ...history].sort((a, b) => b.ts.getTime() - a.ts.getTime()),
    [queue, history],
  );

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
          <p className="label-meta" style={{ marginBottom: '0.375rem' }}>Protocol</p>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
            Floor Sweep
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Acquire underpriced NFTs from Stacks collections via atomic on-chain sweep transactions.
          </p>
        </div>
        {!isConnected && (
          <button className="btn-primary" onClick={connectWallet} style={{ flexShrink: 0 }}>
            Connect Wallet
          </button>
        )}
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
          {txStatus === 'success' ? <CheckCircle size={14} aria-hidden /> :
           txStatus === 'error'   ? <XCircle size={14} aria-hidden />     :
           <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} aria-hidden />}
          <span style={{ fontSize: '0.8rem' }}>
            {txStatus === 'success' && txId ? (
              <>Transaction submitted.{' '}
                <a href={explorerTxLink(txId)} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  View on Explorer <ExternalLink size={10} />
                </a></>
            ) : txStatus === 'error' ? 'Transaction failed. Please try again.'
              : 'Transaction pending — approve in your wallet…'}
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* ── Config Panel ── */}
        <form onSubmit={handleSweep}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.015em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={14} style={{ color: 'var(--accent)' }} aria-hidden />
              Sweep Configuration
            </h2>

            {/* Collection Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <p className="label-meta" style={{ marginBottom: '0.625rem' }}>NFT Collection</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {MOCK_COLLECTIONS.map((c) => {
                  const active = selectedCollection?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedCollection(c); if (!maxPrice) setMaxPrice(String(c.floor)); }}
                      style={{
                        padding: '0.625rem 0.75rem',
                        background: active ? 'var(--accent-dim)' : 'var(--bg-inset)',
                        border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.12s',
                      }}
                    >
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: active ? 'var(--accent)' : 'var(--foreground)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="mono-data" style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>
                          {c.floor} STX
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {c.listed} listed
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="max-price" className="label-meta" style={{ display: 'block', marginBottom: '0.375rem' }}>
                Max Price per NFT (STX)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="max-price"
                  className="input-field"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                {col && (
                  <span
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '0.68rem', color: 'var(--text-muted)', pointerEvents: 'none',
                    }}
                  >
                    Floor: {col.floor} STX
                  </span>
                )}
              </div>
              {col && isAboveFloor && (
                <p style={{ fontSize: '0.7rem', color: 'var(--warning)', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={10} aria-hidden /> Price is above current floor
                </p>
              )}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="quantity" className="label-meta" style={{ display: 'block', marginBottom: '0.375rem' }}>
                Sweep Quantity (1–20)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  id="quantity"
                  className="input-field"
                  type="range"
                  min="1" max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--accent)' }}
                />
                <span className="mono-data" style={{ fontSize: '0.875rem', fontWeight: 700, minWidth: '28px', textAlign: 'right' }}>
                  {qty}
                </span>
              </div>
            </div>

            {/* Slippage */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p className="label-meta" style={{ marginBottom: '0.5rem' }}>Slippage Tolerance</p>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {['0.5', '1.0', '2.0', '5.0'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSlippage(v)}
                    style={{
                      padding: '0.3rem 0.625rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      fontFamily: 'var(--font-mono)',
                      borderColor: slippage === v ? 'var(--accent-border)' : 'var(--border-subtle)',
                      background: slippage === v ? 'var(--accent-dim)' : 'transparent',
                      color: slippage === v ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Breakdown */}
            {sweepCost > 0 && (
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                }}
              >
                <p className="label-meta" style={{ marginBottom: '0.875rem' }}>Estimated Cost</p>
                {[
                  { label: `Sweep cost (${qty}x at ${maxPriceNum} STX)`, value: `${sweepCost.toFixed(2)} STX` },
                  { label: `Protocol fee (${PROTOCOL_FEE_BPS / 100}%)`,   value: `${protocolFee.toFixed(2)} STX` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
                    <span className="mono-data" style={{ fontSize: '0.75rem', color: 'var(--foreground)' }}>{value}</span>
                  </div>
                ))}
                <div
                  style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.625rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--foreground)' }}>Total</span>
                  <span className="mono-data" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {totalCost.toFixed(2)} STX
                  </span>
                </div>
              </div>
            )}

            {/* Info note */}
            <div
              style={{
                display: 'flex', gap: '0.375rem', marginBottom: '1.25rem',
                fontSize: '0.72rem', color: 'var(--text-muted)',
              }}
            >
              <Info size={11} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden />
              Each sweep executes an atomic sweep-and-relist transaction on-chain. Slippage tolerance applies to final price deviation.
            </div>

            {/* Execute Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={!canSweep}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
            >
              {isLoading ? (
                <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Executing…</>
              ) : (
                <><Target size={13} /> Execute Sweep</>
              )}
            </button>
            {!isConnected && (
              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.625rem' }}>
                Connect your wallet to enable sweeping
              </p>
            )}
          </div>
        </form>

        {/* ── Queue + History ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Live Queue */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={13} style={{ color: 'var(--accent)' }} aria-hidden />
              Live Sweep Queue
              {queue.filter((i) => i.status === 'pending').length > 0 && (
                <span
                  className="badge"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)', marginLeft: '0.25rem' }}
                >
                  {queue.filter((i) => i.status === 'pending').length} pending
                </span>
              )}
            </h2>

            {queue.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Target size={22} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} aria-hidden />
                <p style={{ fontSize: '0.8rem' }}>No active sweeps — execute one to see it here.</p>
              </div>
            ) : (
              <div>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.5rem', padding: '0 0.75rem 0.5rem', marginBottom: '0.25rem' }}>
                  {['Collection', 'Token', 'Paid', 'Status'].map((h) => (
                    <span key={h} className="label-meta">{h}</span>
                  ))}
                </div>
                {queue.map((item) => {
                  const s = STATUS_STYLE[item.status];
                  return (
                    <div key={item.id} className="data-table-row" style={{ gridTemplateColumns: '1fr auto auto auto', gap: '0.5rem', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.78rem', fontWeight: 500 }}>{item.collection}</p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>#{item.tokenId}</p>
                      </div>
                      <span className="mono-data" style={{ fontSize: '0.75rem' }}>{item.pricePaid} STX</span>
                      <span className="mono-data" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.total.toFixed(1)}</span>
                      <span className="badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                        {item.status === 'pending'
                          ? <Loader2 size={8} style={{ animation: 'spin 1s linear infinite', marginRight: '3px' }} />
                          : item.status === 'confirmed'
                          ? <CheckCircle size={8} style={{ marginRight: '3px' }} />
                          : <XCircle size={8} style={{ marginRight: '3px' }} />}
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sweep History */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.015em', marginBottom: '1rem' }}>
              Recent History
            </h2>
            <div>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.5rem', padding: '0 0.75rem 0.5rem', marginBottom: '0.25rem' }}>
                {['Collection', 'Token', 'Total', 'Status'].map((h) => (
                  <span key={h} className="label-meta">{h}</span>
                ))}
              </div>
              {allHistory.slice(0, 8).map((item) => {
                const s = STATUS_STYLE[item.status];
                return (
                  <div key={item.id} className="data-table-row" style={{ gridTemplateColumns: '1fr auto auto auto', gap: '0.5rem', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 500 }}>{item.collection}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{formatTs(item.ts)}</p>
                    </div>
                    <span className="mono-data" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      #{item.tokenId}
                    </span>
                    <span className="mono-data" style={{ fontSize: '0.75rem' }}>{item.total.toFixed(1)} STX</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                        {s.label}
                      </span>
                      {item.txId && item.status === 'confirmed' && (
                        <a
                          href={explorerTxLink(item.txId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on Explorer"
                          style={{ color: 'var(--text-muted)', display: 'flex' }}
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
