'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from '@/components/wallet/WalletButton';

const NAV_LINKS = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard',   label: 'Dashboard'   },
  { href: '/liquidity',   label: 'Liquidity'   },
  { href: '/admin',       label: 'Admin'        },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <nav
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            flexShrink: 0,
          }}
        >
          {/* Mark */}
          <span
            aria-hidden
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              background: 'var(--accent)',
              borderRadius: '3px',
              flexShrink: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L9 5L5 9L1 5L5 1Z" fill="white" />
            </svg>
          </span>
          FlyraOS
        </Link>

        {/* Separator */}
        <span
          aria-hidden
          style={{
            width: '1px',
            height: '18px',
            background: 'var(--border-subtle)',
            flexShrink: 0,
          }}
        />

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', flex: 1 }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: 'relative',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--foreground)' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'color 0.15s',
                  letterSpacing: '0.005em',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {label}
                {active && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '0.75rem',
                      right: '0.75rem',
                      height: '1px',
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Wallet */}
        <div style={{ flexShrink: 0 }}>
          <WalletButton />
        </div>
      </nav>
    </header>
  );
}
