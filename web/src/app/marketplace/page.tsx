'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';
import NFTCard from '@/components/marketplace/NFTCard';
import { useNFTListings } from '@/hooks/useNFTData';
import { STX_DECIMALS } from '@/config';

const TIERS = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];
const SORT_OPTIONS = [
  { value: 'price-asc',  label: 'Price: Low → High'  },
  { value: 'price-desc', label: 'Price: High → Low'   },
  { value: 'id-asc',     label: 'ID: Ascending'       },
];

export default function MarketplacePage() {
  const { listings, isLoading } = useNFTListings();
  const [search,   setSearch]   = useState('');
  const [tier,     setTier]     = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort,     setSort]     = useState('price-asc');

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
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.tokenId - b.tokenId;
    });

    return result;
  }, [listings, search, tier, maxPrice, sort]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Page Header */}
      <div
        style={{
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <p className="label-meta" style={{ marginBottom: '0.375rem' }}>Protocol</p>
        <h1
          style={{
            fontSize: '1.625rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: '0.375rem',
          }}
        >
          NFT Marketplace
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Browse and purchase SIP-009 NFTs listed on-chain.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '1.25rem',
          padding: '0.875rem 1rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search
            size={13}
            aria-hidden
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
            aria-label="Search listings"
          />
        </div>

        {/* Separator */}
        <span aria-hidden style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', flexShrink: 0 }} />

        {/* Tier chips */}
        <div
          role="group"
          aria-label="Filter by tier"
          style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}
        >
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              aria-pressed={tier === t}
              style={{
                padding: '0.3rem 0.625rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderColor: tier === t ? 'var(--accent-border)' : 'var(--border-subtle)',
                background: tier === t ? 'var(--accent-dim)' : 'transparent',
                color: tier === t ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.12s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Separator */}
        <span aria-hidden style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', flexShrink: 0 }} />

        {/* Max price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={12} aria-hidden style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            className="input-field"
            type="number"
            placeholder="Max STX"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maximum price in STX"
            style={{ width: '96px' }}
          />
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={12} aria-hidden style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <select
            className="input-field"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort listings"
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
      <p className="label-meta" style={{ marginBottom: '1rem' }}>
        {isLoading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '1rem',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                aspectRatio: '0.9',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 1.5rem',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Tag size={28} style={{ margin: '0 auto 1rem', opacity: 0.3 }} aria-hidden />
          <p style={{ fontWeight: 500, marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            No listings found
          </p>
          <p style={{ fontSize: '0.8rem' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '1rem',
          }}
        >
          {filtered.map((listing) => (
            <NFTCard key={`${listing.contractAddress}-${listing.tokenId}`} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
