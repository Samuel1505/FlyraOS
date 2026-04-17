'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  BarChart2,
  ArrowRight,
  TrendingUp,
  Flame,
  Layers,
  ChevronDown,
  Wallet,
  Zap,
  RefreshCw,
  Target,
  Vault,
} from 'lucide-react';
import { useProtocolStats } from '@/hooks/useNFTData';
import { formatSTX, formatCompact } from '@/lib/utils';
import { STX_DECIMALS, FLYRA_DECIMALS } from '@/config';

/* ─── Vault Visual ──────────────────────────────── */
function VaultVisual() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '460px', margin: '0 auto' }}>
      <style>{`
        @keyframes vault-cw   { to { transform: rotate(360deg);  } }
        @keyframes vault-ccw  { to { transform: rotate(-360deg); } }
        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float-b { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(6px)} }
        @keyframes float-c { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
      <svg viewBox="0 0 460 460" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Outer orbit ring */}
        <circle cx="230" cy="230" r="215"
          stroke="rgba(99,102,241,0.10)" strokeWidth="1" strokeDasharray="12 8"
          style={{ transformOrigin: '230px 230px', animation: 'vault-cw 100s linear infinite' }} />

        {/* Mid ring */}
        <circle cx="230" cy="230" r="184"
          stroke="rgba(99,102,241,0.05)" strokeWidth="1" />

        {/* Vault body */}
        <rect x="68" y="68" width="324" height="324" rx="4"
          fill="#0D0D18" stroke="rgba(99,102,241,0.28)" strokeWidth="1.5" />

        {/* Left hinge bars */}
        <rect x="52" y="140" width="20" height="30" rx="2"
          fill="#111120" stroke="rgba(99,102,241,0.22)" strokeWidth="1" />
        <rect x="52" y="290" width="20" height="30" rx="2"
          fill="#111120" stroke="rgba(99,102,241,0.22)" strokeWidth="1" />

        {/* Right handle */}
        <rect x="388" y="206" width="14" height="52" rx="3"
          fill="#111120" stroke="rgba(99,102,241,0.22)" strokeWidth="1" />
        <circle cx="389" cy="207" r="5" fill="#111120" stroke="rgba(99,102,241,0.28)" strokeWidth="1" />
        <circle cx="389" cy="257" r="5" fill="#111120" stroke="rgba(99,102,241,0.28)" strokeWidth="1" />

        {/* Corner bolts */}
        {([[105,105],[355,105],[105,355],[355,355]] as [number,number][]).map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="7.5"
            fill="#0D0D18" stroke="rgba(99,102,241,0.25)" strokeWidth="1.2" />
        ))}

        {/* Vault door */}
        <circle cx="230" cy="230" r="110"
          fill="#111120" stroke="rgba(99,102,241,0.38)" strokeWidth="1.5" />

        {/* Dashed inner ring — counter-rotates */}
        <circle cx="230" cy="230" r="88"
          fill="#0A0A0F" stroke="rgba(99,102,241,0.14)" strokeWidth="1" strokeDasharray="6 5"
          style={{ transformOrigin: '230px 230px', animation: 'vault-ccw 70s linear infinite' }} />

        {/* Crosshair lock — rotates */}
        <g style={{ transformOrigin: '230px 230px', animation: 'vault-cw 28s linear infinite' }}>
          <line x1="230" y1="150" x2="230" y2="310"
            stroke="rgba(99,102,241,0.52)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="150" y1="230" x2="310" y2="230"
            stroke="rgba(99,102,241,0.52)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="230" cy="152" r="5.5" fill="rgba(99,102,241,0.75)" />
          <circle cx="230" cy="308" r="5.5" fill="rgba(99,102,241,0.75)" />
          <circle cx="152" cy="230" r="5.5" fill="rgba(99,102,241,0.75)" />
          <circle cx="308" cy="230" r="5.5" fill="rgba(99,102,241,0.75)" />
        </g>

        {/* Center lock pip */}
        <circle cx="230" cy="230" r="26" fill="#0D0D18" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" />
        <circle cx="230" cy="230" r="14" fill="#6366F1" opacity="0.97" />
        <circle cx="230" cy="230" r="6"  fill="rgba(255,255,255,0.28)" />

        {/* NFT card — left */}
        <g style={{ animation: 'float-a 5.2s ease-in-out infinite' }}>
          <rect x="6" y="168" width="48" height="56" rx="3"
            fill="#111120" stroke="rgba(99,102,241,0.30)" strokeWidth="1" />
          <rect x="10" y="172" width="22" height="22" rx="2" fill="rgba(99,102,241,0.22)" />
          <rect x="10" y="199" width="30" height="2.5" rx="1" fill="rgba(255,255,255,0.08)" />
          <rect x="10" y="205" width="22" height="2"   rx="1" fill="rgba(255,255,255,0.05)" />
          <rect x="10" y="211" width="26" height="2"   rx="1" fill="rgba(255,255,255,0.04)" />
        </g>

        {/* NFT card — top-right */}
        <g style={{ animation: 'float-b 7s ease-in-out infinite' }}>
          <rect x="406" y="96" width="48" height="56" rx="3"
            fill="#111120" stroke="rgba(16,185,129,0.24)" strokeWidth="1" />
          <rect x="410" y="100" width="22" height="22" rx="2" fill="rgba(16,185,129,0.18)" />
          <rect x="410" y="127" width="30" height="2.5" rx="1" fill="rgba(255,255,255,0.07)" />
          <rect x="410" y="133" width="22" height="2"   rx="1" fill="rgba(255,255,255,0.04)" />
          <rect x="410" y="139" width="26" height="2"   rx="1" fill="rgba(255,255,255,0.03)" />
        </g>

        {/* NFT card — bottom-right */}
        <g style={{ animation: 'float-c 8.5s ease-in-out infinite' }}>
          <rect x="406" y="316" width="48" height="56" rx="3"
            fill="#111120" stroke="rgba(245,158,11,0.22)" strokeWidth="1" />
          <rect x="410" y="320" width="22" height="22" rx="2" fill="rgba(245,158,11,0.16)" />
          <rect x="410" y="347" width="30" height="2.5" rx="1" fill="rgba(255,255,255,0.06)" />
          <rect x="410" y="353" width="22" height="2"   rx="1" fill="rgba(255,255,255,0.04)" />
          <rect x="410" y="359" width="26" height="2"   rx="1" fill="rgba(255,255,255,0.03)" />
        </g>
      </svg>
    </div>
  );
}

/* ─── Animated Stat Counter ─────────────────────── */
function AnimatedStat({
  end,
  prefix = '',
  suffix = '',
  label,
  decimals = 0,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1800;
          const start = performance.now();
          const update = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(eased * end);
            if (p < 1) requestAnimationFrame(update);
            else setCount(end);
          };
          requestAnimationFrame(update);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  const display =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <p
        className="mono-data"
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--foreground)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        {prefix}{display}{suffix}
      </p>
      <p className="label-meta" style={{ marginTop: '0.625rem' }}>{label}</p>
    </div>
  );
}

/* ─── FAQ Item ──────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: 'What is FlyraOS?',
    a: 'FlyraOS is a decentralized NFT treasury protocol on the Stacks blockchain. It automates floor sweeping, premium relisting, and FLYRA token burns — creating a self-sustaining, deflationary treasury that compounds value for all participants.',
  },
  {
    q: 'How does the floor sweep work?',
    a: 'The floor sweep mechanism monitors Stacks NFT collection listings in real time. When underpriced assets are detected, the protocol executes atomic on-chain purchases via the sweep-and-relist contract function — acquiring NFTs below fair value in a single transaction.',
  },
  {
    q: 'What is auto-relist and how does it generate revenue?',
    a: 'After sweeping an NFT, FlyraOS automatically relists it at a target price above the acquisition cost. The markup generates protocol revenue. A portion of that revenue is allocated to periodic FLYRA buyback-and-burn operations.',
  },
  {
    q: 'How does burning FLYRA benefit holders?',
    a: 'Each burn permanently removes FLYRA from the circulating supply, creating deflationary pressure that benefits existing holders over time. Protocol revenue directly funds burns, creating a sustainable feedback loop between treasury activity and token value.',
  },
  {
    q: 'What wallets are supported?',
    a: 'FlyraOS supports Hiro Wallet and Xverse — the two leading Stacks ecosystem wallets. Connect directly through the app using @stacks/connect. No seed phrases or approvals are stored by the protocol.',
  },
  {
    q: 'Is the protocol audited?',
    a: 'Smart contract security is a top priority. The Clarity smart contracts are available open-source on GitHub for community review. Formal audit reports will be published in the documentation. FlyraOS inherits Bitcoin-level settlement security via the Stacks layer.',
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          padding: '1.25rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: '0.9rem',
            color: isOpen ? 'var(--foreground)' : 'var(--text-secondary)',
            transition: 'color 0.15s',
            letterSpacing: '-0.01em',
          }}
        >
          {q}
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          style={{
            color: 'var(--text-muted)',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <p
          style={{
            paddingBottom: '1.25rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            lineHeight: 1.8,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: Target,
    title: 'Floor Sweep',
    description: 'Atomic on-chain floor acquisition. Set your max price, quantity, and slippage tolerance — the protocol executes in a single transaction.',
    href: '/floor-sweep',
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    border: 'var(--accent-border)',
  },
  {
    icon: BarChart2,
    title: 'Treasury Dashboard',
    description: 'Monitor treasury value, portfolio holdings, sweep activity, and FLYRA burn mechanics with real-time protocol metrics.',
    href: '/treasury',
    color: '#60A5FA',
    dim: 'rgba(96,165,250,0.10)',
    border: 'rgba(96,165,250,0.25)',
  },
  {
    icon: Flame,
    title: 'Burn FLYRA',
    description: 'Participate in deflationary burns. Each FLYRA destroyed reduces circulating supply permanently, captured on-chain forever.',
    href: '/burn',
    color: 'var(--destructive)',
    dim: 'var(--destructive-dim)',
    border: 'var(--destructive-border)',
  },
  {
    icon: ShoppingBag,
    title: 'NFT Marketplace',
    description: 'Browse and purchase SIP-009 NFTs listed on-chain. Tier filters, price sorts, and instant wallet settlement.',
    href: '/marketplace',
    color: 'var(--success)',
    dim: 'var(--success-dim)',
    border: 'var(--success-border)',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Link your Hiro or Xverse Stacks wallet with a single click. Your principal is loaded instantly — no signatures, no custodians.',
  },
  {
    step: '02',
    icon: Zap,
    title: 'Configure Floor Sweep',
    description: 'Select an NFT collection, set a maximum price per token, and define your sweep quantity. The protocol scans listings and executes atomic on-chain purchases.',
  },
  {
    step: '03',
    icon: RefreshCw,
    title: 'Auto-Relist & Burn',
    description: 'Swept NFTs are automatically relisted at a target markup via sweep-and-relist. Revenue funds periodic FLYRA burns, reducing total supply permanently.',
  },
];

export default function Home() {
  const { stats } = useProtocolStats();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const STATS = [
    {
      label: 'Total Volume',
      value: stats ? `${formatSTX(stats.totalVolume)} STX` : '—',
      icon: TrendingUp,
    },
    {
      label: 'Active Listings',
      value: stats ? String(stats.totalListings) : '—',
      icon: Layers,
    },
    {
      label: 'FLYRA Burned',
      value: stats ? formatCompact(stats.totalBurned / FLYRA_DECIMALS) : '—',
      icon: Flame,
    },
    {
      label: 'Floor Price',
      value: stats ? `${formatSTX(stats.floorPrice)} STX` : '—',
      icon: BarChart2,
    },
  ];

  return (
    <div style={{ background: 'var(--background)' }}>

      {/* ── Hero ─────────────────────────────────── */}
      <section
        className="dot-grid"
        style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          padding: '5rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Text */}
          <div style={{ animation: 'fade-up 0.6s ease both' }}>
            {/* Live badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: '2.25rem',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              Live on Stacks Testnet
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.06,
                color: 'var(--foreground)',
                marginBottom: '1.5rem',
              }}
            >
              Treasury-Grade{' '}
              <span style={{ color: 'var(--accent)' }}>NFT Infrastructure.</span>
              <br />
              Built on Stacks.
            </h1>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                marginBottom: '2.25rem',
                maxWidth: '480px',
              }}
            >
              FlyraOS automates floor sweeps, premium auto-relists, and FLYRA token
              burns to sustain institutional-grade NFT treasury operations on
              Bitcoin&apos;s most scalable layer.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href="/floor-sweep"
                className="btn-primary"
                style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem' }}
              >
                <Zap size={14} />
                Launch App
                <ArrowRight size={13} style={{ marginLeft: '0.125rem' }} />
              </Link>
              <Link
                href="/treasury"
                className="btn-outline"
                style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem' }}
              >
                <BarChart2 size={14} />
                View Treasury
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginTop: '2.5rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { v: 'Non-Custodial' },
                { v: 'Open Source'   },
                { v: 'On-Chain'      },
              ].map(({ v }) => (
                <span
                  key={v}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                    }}
                  />
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Vault */}
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'fade-up 0.8s ease 0.1s both' }}>
            <VaultVisual />
          </div>
        </div>
      </section>

      {/* ── Protocol Stats Bar ───────────────────── */}
      <section
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1px',
            background: 'var(--border-subtle)',
          }}
        >
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '1rem 1.25rem',
                background: 'var(--bg-surface)',
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <Icon size={13} />
              </span>
              <div>
                <p className="label-meta" style={{ marginBottom: '0.2rem' }}>{label}</p>
                <p className="mono-data" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <p className="label-meta" style={{ marginBottom: '0.625rem' }}>Protocol Flow</p>
            <h2
              style={{
                fontSize: 'clamp(1.375rem, 2.5vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '0.625rem',
              }}
            >
              Three steps to a working treasury
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px' }}>
              From wallet connection to automated on-chain operations in minutes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1px',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div
                key={step}
                style={{
                  padding: '2rem',
                  background: 'var(--background)',
                  position: 'relative',
                }}
              >
                {/* Step number */}
                <span
                  className="mono-data"
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    letterSpacing: '0.08em',
                    display: 'block',
                    marginBottom: '1.25rem',
                  }}
                >
                  {step}
                </span>
                {/* Icon */}
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    color: 'var(--accent)',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={15} />
                </span>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '0.625rem',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocol Stats — Animated Counters ───── */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: 'var(--bg-inset)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="label-meta" style={{ marginBottom: '0.625rem' }}>Protocol Metrics</p>
            <h2
              style={{
                fontSize: 'clamp(1.375rem, 2.5vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              Numbers that speak for the protocol
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1px',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {[
              { end: 2.4,       prefix: '$',  suffix: 'M',     label: 'Total Value Locked',  decimals: 1 },
              { end: 1247,      prefix: '',   suffix: '',       label: 'NFTs Swept All-Time',  decimals: 0 },
              { end: 4.2,       prefix: '',   suffix: 'K FLYRA', label: 'FLYRA Burned',        decimals: 1 },
              { end: 12,        prefix: '',   suffix: '',       label: 'Collections Supported', decimals: 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ padding: '2.5rem 1.5rem', background: 'var(--bg-surface)' }}
              >
                <AnimatedStat {...stat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <p className="label-meta" style={{ marginBottom: '0.625rem' }}>Protocol Modules</p>
            <h2
              style={{
                fontSize: 'clamp(1.375rem, 2.5vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '0.625rem',
              }}
            >
              Built for serious operators
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px' }}>
              A full-stack on-chain protocol — marketplace, liquidity pool, sweep engine, and burn mechanics.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1px',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {FEATURES.map(({ icon: Icon, title, description, href, color, dim, border }) => (
              <Link key={href} href={href} className="feature-card">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: dim,
                    border: `1px solid ${border}`,
                    color,
                    marginBottom: '1.125rem',
                  }}
                  aria-hidden
                >
                  <Icon size={15} />
                </span>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {title}
                  <ArrowRight size={13} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} aria-hidden />
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <p className="label-meta" style={{ marginBottom: '0.625rem' }}>Questions</p>
            <h2
              style={{
                fontSize: 'clamp(1.375rem, 2.5vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              Frequently asked
            </h2>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {FAQ_ITEMS.map((item, idx) => (
              <FAQItem
                key={idx}
                q={item.q}
                a={item.a}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section
        style={{
          padding: '5rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--background)',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <p className="label-meta" style={{ marginBottom: '1rem' }}>Get Started</p>
          <h2
            style={{
              fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
            }}
          >
            Deploy your treasury strategy today.
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.25rem', fontSize: '0.9rem', lineHeight: 1.75 }}>
            No signups. No custodians. Fully on-chain. Connect your Stacks wallet and
            start operating a professional NFT treasury in minutes.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/floor-sweep"
              className="btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '0.875rem' }}
            >
              <Zap size={14} />
              Launch Floor Sweep
            </Link>
            <Link
              href="/treasury"
              className="btn-outline"
              style={{ padding: '0.75rem 2rem', fontSize: '0.875rem' }}
            >
              <BarChart2 size={14} />
              View Treasury
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
