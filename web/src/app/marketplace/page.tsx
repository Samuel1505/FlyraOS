'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';
import NFTCard from '@/components/marketplace/NFTCard';
import { useNFTListings } from '@/hooks/useNFTData';
import { STX_DECIMALS } from '@/config';

const TIERS = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];
const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'id-asc', label: 'ID: Ascending' },
];

export default function MarketplacePage() {
  const { listings, isLoading } = useNFTListings();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('price-asc');

  const filtered = useMemo(() => {
    let result = [...listings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.metadata?.name?.toLowerCase().includes(q) ||
          String(l.tokenId).includes(q),
      );
    }

    if (tier !== 'All') {
      result = result.filter(
        (l) =>
          l.metadata?.attributes?.find((a) => a.trait_type === 'Tier')?.value === tier,
      );
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice) * STX_DECIMALS;
      result = result.filter((l) => l.price <= max);
    }

    result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.tokenId - b.tokenId;
    });

    return result;
  }, [listings, search, tier, maxPrice, sort]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="label-meta" style={{ marginBottom: '0.4rem' }}>Protocol</p>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem',
          }}
        >
          NFT Marketplace
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Browse and purchase SIP-009 NFTs listed on-chain.
        </p>
      </div>

      {/* Filters Row */}
      <div
        className="card"
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '0.625rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Search by name or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2rem' }}
          />
        </div>

        {/* Tier filter */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: tier === t ? 'var(--primary)' : 'var(--border-default)',
                background: tier === t ? 'var(--primary-dim)' : 'transparent',
                color: tier === t ? '#60a5fa' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Max price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Tag size={13} style={{ color: 'var(--text-muted)' }} />
          <input
            className="input-field"
            type="number"
            placeholder="Max STX"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: '100px' }}
          />
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <SlidersHorizontal size={13} style={{ color: 'var(--text-muted)' }} />
          <select
            className="input-field"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ background: 'var(--bg-elevated)' }}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p
        className="label-meta"
        style={{ marginBottom: '1rem' }}
      >
        {isLoading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{
                aspectRatio: '0.9',
                background: 'linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            color: 'var(--text-muted)',
          }}
        >
          <Tag size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p style={{ fontWeight: 500 }}>No listings found</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {filtered.map((listing) => (
            <NFTCard key={`${listing.contractAddress}-${listing.tokenId}`} listing={listing} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
