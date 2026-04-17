'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import WalletButton from '@/components/wallet/WalletButton';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: '/',            label: 'Home'        },
  { href: '/dashboard',   label: 'Dashboard'   },
  { href: '/floor-sweep', label: 'Floor Sweep' },
  { href: '/treasury',    label: 'Treasury'    },
  { href: '/burn',        label: 'Burn FLYRA'  },
  { href: 'https://github.com/Samuel1505/FlyraOS', label: 'Docs', external: true },
];

function LogoDiamond() {
  return (
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
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, external?: boolean) => {
    if (external) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkBaseStyle = (active: boolean): React.CSSProperties => ({
    position: 'relative',
    padding: '0.375rem 0.625rem',
    fontSize: '0.8rem',
    fontWeight: active ? 500 : 400,
    color: active ? 'var(--foreground)' : 'var(--text-muted)',
    borderRadius: 'var(--radius-md)',
    transition: 'color 0.15s',
    letterSpacing: '0.005em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    whiteSpace: 'nowrap',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(12px)',
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
          gap: '1.25rem',
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
            fontSize: '0.95rem',
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            flexShrink: 0,
          }}
        >
          <LogoDiamond />
          FlyraOS
        </Link>

        {/* Separator */}
        <span
          aria-hidden
          style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', flexShrink: 0 }}
        />

        {/* Desktop Nav Links */}
        <div className="nav-desktop-links">
          {NAV_LINKS.map(({ href, label, external }) => {
            const active = isActive(href, external);
            if (external) {
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkBaseStyle(false)}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {label}
                  <ExternalLink size={9} />
                </a>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                style={linkBaseStyle(active)}
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
                      left: '0.625rem',
                      right: '0.625rem',
                      height: '1px',
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Wallet + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
          <WalletButton />
          <button
            className="nav-hamburger-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(10,10,15,0.98)',
            padding: '0.5rem 1.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem',
          }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label, external }) => {
            const active = isActive(href, external);
            const style: React.CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.625rem 0.5rem',
              fontSize: '0.875rem',
              fontWeight: active ? 500 : 400,
              color: active ? 'var(--foreground)' : 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
            };
            if (external) {
              return (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={style}
                  onClick={() => setMobileOpen(false)}>
                  {label} <ExternalLink size={10} />
                </a>
              );
            }
            return (
              <Link key={href} href={href} style={style} onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
