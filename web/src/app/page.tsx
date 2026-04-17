import Link from 'next/link';
import {
  ShoppingBag,
  BarChart2,
  Droplets,
  ArrowRight,
  TrendingUp,
  Flame,
  Layers,
  Shield,
} from 'lucide-react';

const FEATURES = [
  {
    icon: ShoppingBag,
    title: 'NFT Marketplace',
    description:
      'Browse and purchase floor-swept NFTs listed directly on-chain via the SIP-009 standard.',
    href: '/marketplace',
    accentColor: 'var(--accent)',
    accentDim: 'var(--accent-dim)',
    accentBorder: 'var(--accent-border)',
  },
  {
    icon: BarChart2,
    title: 'Strategy Dashboard',
    description:
      'Monitor floor price history, protocol volume, and FLYRA burn mechanics in real time.',
    href: '/dashboard',
    accentColor: 'var(--success)',
    accentDim: 'var(--success-dim)',
    accentBorder: 'var(--success-border)',
  },
  {
    icon: Droplets,
    title: 'Liquidity Pool',
    description:
      'Track STX/FLYRA XYK pool reserves, fee rates, and LP performance metrics.',
    href: '/liquidity',
    accentColor: '#60A5FA',
    accentDim: 'rgba(96,165,250,0.10)',
    accentBorder: 'rgba(96,165,250,0.25)',
  },
  {
    icon: Shield,
    title: 'Admin Controls',
    description:
      'Deployer-gated floor sweeps, premium relisting, and FLYRA token burn controls.',
    href: '/admin',
    accentColor: 'var(--warning)',
    accentDim: 'var(--warning-dim)',
    accentBorder: 'var(--warning-border)',
  },
];

const STATS = [
  { label: 'Total Listings', value: '247',       icon: Layers    },
  { label: 'Floor Price',    value: '8 STX',      icon: TrendingUp },
  { label: 'FLYRA Burned',   value: '4.2M',       icon: Flame     },
  { label: 'Total Volume',   value: '1,340 STX',  icon: BarChart2 },
];

export default function Home() {
  return (
    <div style={{ background: 'var(--background)' }}>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '5rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '680px', width: '100%' }}>

          {/* Status badge */}
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
              marginBottom: '2.5rem',
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
              fontSize: 'clamp(2rem, 5.5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: 'var(--foreground)',
              marginBottom: '1.5rem',
            }}
          >
            The NFT Treasury
            <br />
            <span style={{ color: 'var(--accent)' }}>Protocol</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
            }}
          >
            FlyraOS is a professional-grade NFT treasury protocol on Stacks.
            Floor sweep, auto-relist, and FLYRA token burns drive sustainable protocol value.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/marketplace" className="btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
              <ShoppingBag size={15} />
              Browse Marketplace
              <ArrowRight size={14} style={{ marginLeft: '0.125rem' }} />
            </Link>
            <Link href="/dashboard" className="btn-outline" style={{ padding: '0.625rem 1.5rem' }}>
              <BarChart2 size={15} />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0',
          }}
        >
          {STATS.map(({ label, value, icon: Icon }, idx) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1.25rem',
                borderRight: idx < STATS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
                <p
                  className="mono-data"
                  style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--foreground)' }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px' }}>
            A full-stack protocol with on-chain marketplace, liquidity pool, and FLYRA token mechanics.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            gap: '1px',
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description, href, accentColor, accentDim, accentBorder }) => (
            <Link key={href} href={href} className="feature-card">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: accentDim,
                  border: `1px solid ${accentBorder}`,
                  marginBottom: '1.125rem',
                  color: accentColor,
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
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
                <ArrowRight size={13} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: '4rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.875rem',
              letterSpacing: '-0.03em',
            }}
          >
            Ready to start trading?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Connect your Stacks wallet and join the FlyraOS protocol.
          </p>
          <Link
            href="/marketplace"
            className="btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}
          >
            <ShoppingBag size={15} />
            Open Marketplace
          </Link>
        </div>
      </section>
    </div>
  );
}
