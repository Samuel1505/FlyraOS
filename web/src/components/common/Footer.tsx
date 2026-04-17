'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCheck, ExternalLink } from 'lucide-react';
import { STRATEGY_TOKEN_ADDRESS } from '@/config';

const FOOTER_LINKS = [
  { label: 'Docs',         href: 'https://github.com/Samuel1505/FlyraOS', external: true  },
  { label: 'GitHub',       href: 'https://github.com/Samuel1505/FlyraOS', external: true  },
  { label: 'Twitter / X',  href: 'https://twitter.com',                   external: true  },
  { label: 'Discord',      href: 'https://discord.com',                   external: true  },
  { label: 'Audit Report', href: 'https://github.com/Samuel1505/FlyraOS', external: true  },
];

const APP_LINKS = [
  { label: 'Floor Sweep', href: '/floor-sweep' },
  { label: 'Treasury',    href: '/treasury'    },
  { label: 'Burn FLYRA',  href: '/burn'        },
  { label: 'Dashboard',   href: '/dashboard'   },
  { label: 'Marketplace', href: '/marketplace' },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(STRATEGY_TOKEN_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}
    >
      {/* Main footer */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '3rem 1.5rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Brand */}
        <div style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <span
              aria-hidden
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                background: 'var(--accent)',
                borderRadius: '3px',
              }}
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L9 5L5 9L1 5L5 1Z" fill="white" />
              </svg>
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '-0.015em' }}>
              FlyraOS
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '240px' }}>
            Treasury-grade NFT infrastructure on Stacks. Sweep. Relist. Burn. Sustain.
          </p>

          {/* Built on Stacks badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '1.25rem',
              padding: '0.25rem 0.625rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {/* Stacks-ish icon */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '14px',
                height: '14px',
                background: '#FC6432',
                borderRadius: '2px',
                fontWeight: 800,
                fontSize: '0.6rem',
                color: '#fff',
                letterSpacing: 0,
                fontFamily: 'var(--font-mono)',
              }}
              aria-hidden
            >
              S
            </span>
            Built on Stacks
          </div>
        </div>

        {/* App Links */}
        <div>
          <p className="label-meta" style={{ marginBottom: '1rem' }}>Protocol</p>
          <nav
            aria-label="App navigation"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
          >
            {APP_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </nav>
        </div>

        {/* External Links */}
        <div>
          <p className="label-meta" style={{ marginBottom: '1rem' }}>Resources</p>
          <nav
            aria-label="Resource links"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
          >
            {FOOTER_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                {label}
                <ExternalLink size={9} aria-hidden />
              </a>
            ))}
          </nav>
        </div>

        {/* Contract Address */}
        <div>
          <p className="label-meta" style={{ marginBottom: '1rem' }}>FLYRA Contract</p>
          <div
            style={{
              padding: '0.625rem 0.75rem',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                wordBreak: 'break-all',
                lineHeight: 1.5,
              }}
            >
              {STRATEGY_TOKEN_ADDRESS}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy contract address"
              title={copied ? 'Copied!' : 'Copy address'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                background: copied ? 'var(--success-dim)' : 'var(--bg-elevated)',
                border: `1px solid ${copied ? 'var(--success-border)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-sm)',
                color: copied ? 'var(--success)' : 'var(--text-muted)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            </button>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            strategy-token.clar on Stacks Testnet
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} FlyraOS Protocol. MIT License.
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Not financial advice. Use at your own risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
