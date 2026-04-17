'use client';

import { useState } from 'react';
import { ShoppingCart, User, Loader2 } from 'lucide-react';
import { formatSTX, shortenAddress } from '@/lib/utils';
import { useWallet } from '@/lib/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import type { NFTListing } from '@/types';

const TIER_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Common:    { text: '#9898B0', bg: 'rgba(152,152,176,0.10)', border: 'rgba(152,152,176,0.20)' },
  Rare:      { text: '#60A5FA', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.22)'  },
  Epic:      { text: '#A78BFA', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.22)' },
  Legendary: { text: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)'  },
};

export default function NFTCard({ listing }: { listing: NFTListing }) {
  const { isConnected } = useWallet();
  const { buyNFT, isLoading } = useContract();
  const [buying, setBuying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const tier = listing.metadata?.attributes?.find(
    (a) => a.trait_type === 'Tier',
  )?.value ?? 'Common';

  const tierStyle = TIER_COLORS[tier] ?? TIER_COLORS.Common;

  async function handleBuy() {
    if (!isConnected) return;
    setBuying(true);
    try {
      await buyNFT(listing.contractAddress, listing.tokenId, listing.price);
    } catch {
      // user cancelled or error
    } finally {
      setBuying(false);
    }
  }

  return (
    <article
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-default)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg-inset)' }}>
        <img
          src={listing.metadata?.image ?? `https://picsum.photos/seed/${listing.tokenId}/400/400`}
          alt={listing.metadata?.name ?? `NFT #${listing.tokenId}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.15s',
            opacity: hovered ? 0.9 : 1,
          }}
        />
        {/* Tier badge */}
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: tierStyle.bg,
            color: tierStyle.text,
            border: `1px solid ${tierStyle.border}`,
          }}
        >
          {tier}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '0.75rem' }}>
        <div style={{ marginBottom: '0.625rem' }}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: '0.85rem',
              marginBottom: '0.25rem',
              color: 'var(--foreground)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {listing.metadata?.name ?? `FlyraOS #${listing.tokenId}`}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}
          >
            <User size={9} aria-hidden />
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {shortenAddress(listing.maker)}
            </span>
          </div>
        </div>

        {/* Price + Buy */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.625rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <p className="label-meta" style={{ marginBottom: '0.15rem' }}>Price</p>
            <p
              className="mono-data"
              style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--foreground)' }}
            >
              {formatSTX(listing.price)}{' '}
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                STX
              </span>
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={handleBuy}
            disabled={!isConnected || buying || isLoading}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            aria-label={`Buy ${listing.metadata?.name ?? `NFT #${listing.tokenId}`}`}
          >
            {buying
              ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
              : <ShoppingCart size={12} />
            }
            {buying ? 'Buying…' : 'Buy'}
          </button>
        </div>
      </div>
    </article>
  );
}
