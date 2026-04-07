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
    color: 'var(--primary)',
    bgColor: 'rgba(7,84,209,0.12)',
    borderColor: 'rgba(7,84,209,0.25)',
  },
  {
    icon: BarChart2,
    title: 'Strategy Dashboard',
    description:
      'Monitor floor price history, protocol volume, and FLYRA burn mechanics in real time.',
    href: '/dashboard',
    color: 'var(--accent)',
    bgColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.25)',
  },
  {
    icon: Droplets,
    title: 'Liquidity Pool',
    description:
      'Track STX/FLYRA XYK pool reserves, fee rates, and LP performance metrics.',
    href: '/liquidity',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.12)',
    borderColor: 'rgba(139,92,246,0.25)',
  },
  {
    icon: Shield,
    title: 'Admin Controls',
    description:
      'Deployer-gated floor sweeps, premium relisting, and FLYRA token burn controls.',
    href: '/admin',
    color: 'var(--warning)',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.25)',
  },
];

const STATS = [
  { label: 'Total Listings', value: '247', icon: Layers },
  { label: 'Floor Price', value: '8 STX', icon: TrendingUp },
  { label: 'FLYRA Burned', value: '4.2M', icon: Flame },
  { label: 'Total Volume', value: '1,340 STX', icon: BarChart2 },
];

export default function Home() {
  return (
    <div style={{ background: 'var(--background)' }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Background glow orbs */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(7,84,209,0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '15%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.875rem',
              background: 'var(--primary-dim)',
              border: '1px solid rgba(7,84,209,0.3)',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#60a5fa',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--primary)',
                animation: 'pulse 2s infinite',
              }}
            />
            Live on Stacks Testnet
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              color: 'var(--foreground)',
              marginBottom: '1.5rem',
            }}
          >
            The NFT Treasury{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0754d1, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Protocol
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
            }}
          >
            FlyraOS is a professional-grade NFT treasury protocol on Stacks. Floor
            sweep, auto-relist, and FLYRA token burns drive sustainable protocol value.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/marketplace" className="btn-primary hero-cta-primary">
              <ShoppingBag size={16} />
              Browse Marketplace
              <ArrowRight size={15} />
            </Link>
            <Link href="/dashboard" className="btn-outline hero-cta-outline">
              <BarChart2 size={16} />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        style={{
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '7px',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} />
              </span>
              <div>
                <p className="label-meta">{label}</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="label-meta" style={{ marginBottom: '0.75rem' }}>Protocol Features</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.025em' }}>
            Everything you need
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', maxWidth: '480px', margin: '0.75rem auto 0' }}>
            A full-stack protocol with on-chain marketplace, liquidity pool, and FLYRA token mechanics.
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
          {FEATURES.map(({ icon: Icon, title, description, href, color, bgColor, borderColor }) => (
            <Link key={href} href={href} className="feature-card">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  marginBottom: '1rem',
                  color,
                }}
              >
                <Icon size={18} />
              </span>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {title}
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
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
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
          Ready to start trading?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Connect your Stacks wallet and join the FlyraOS protocol.
        </p>
        <Link href="/marketplace" className="btn-accent" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
          <ShoppingBag size={16} />
          Open Marketplace
        </Link>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
