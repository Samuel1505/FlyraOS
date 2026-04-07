'use client';

import { useState } from 'react';
import { ShoppingCart, User, Loader2 } from 'lucide-react';
import { formatSTX, shortenAddress } from '@/lib/utils';
import { useWallet } from '@/lib/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import type { NFTListing } from '@/types';

const TIER_COLORS: Record<string, string> = {
  Common: '#6b7280',
  Rare: '#3b82f6',
  Epic: '#8b5cf6',
  Legendary: '#f59e0b',
};

export default function NFTCard({ listing }: { listing: NFTListing }) {
  const { isConnected } = useWallet();
  const { buyNFT, isLoading } = useContract();
  const [buying, setBuying] = useState(false);

  const tier = listing.metadata?.attributes?.find(
    (a) => a.trait_type === 'Tier',
  )?.value ?? 'Common';

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
      className="card"
      style={{
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow =
          '0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px var(--border-default)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
        <img
          src={listing.metadata?.image ?? `https://picsum.photos/seed/${listing.tokenId}/400/400`}
          alt={listing.metadata?.name ?? `NFT #${listing.tokenId}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Tier badge */}
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: `${TIER_COLORS[tier]}22`,
            color: TIER_COLORS[tier],
            border: `1px solid ${TIER_COLORS[tier]}44`,
          }}
        >
          {tier}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '0.875rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            {listing.metadata?.name ?? `FlyraOS #${listing.tokenId}`}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <User size={10} />
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
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <p className="label-meta" style={{ marginBottom: '0.1rem' }}>Price</p>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>
              {formatSTX(listing.price)}{' '}
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                STX
              </span>
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={handleBuy}
            disabled={!isConnected || buying || isLoading}
            style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}
          >
            {buying ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <ShoppingCart size={13} />}
            {buying ? 'Buying…' : 'Buy'}
          </button>
        </div>
      </div>
    </article>
  );
}
