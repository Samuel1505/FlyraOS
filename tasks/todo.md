# FlyraOS Contracts Implementation Plan

## Infrastructure Setup
- [x] Add `sip-009-nft-trait` and `sip-010-ft-trait` to `Clarinet.toml` requirements.
- [x] Define shared traits:
  - [x] `contracts/traits/liquidity-pool-trait.clar`
  - [x] Update `Clarinet.toml` to include custom traits.

## 1. `funny-dog.clar` (SIP-009 NFT)
- [x] Implement `sip-009-nft-trait`.
- [x] Sequential minting logic with configurable collection cap (e.g., 10,000 max).
- [x] Base URI builder and update function (admin only).
- [x] Standard transfer and ownership functions.

## 2. `nft-marketplace.clar`
- [x] Minimal STX-only marketplace.
- [x] `list-in-ustx`: List NFT for sale with a specified price and expiry edge cases.
- [x] `cancel-listing`: Cancel an active listing (only owner).
- [x] `buy-in-ustx`: Fulfill active listing and handle principal transfers.

## 3. `strategy-token.clar` (SIP-010 & Strategy Logic)
- [x] Implement `sip-010-ft-trait` for FLYRA token.
- [x] Treasury logic: receive funds, hold NFTs.
- [x] Interlock with liquidity pool and marketplace:
  - [x] Auto-relisting swept NFTs.
  - [x] Swap-triggered token burns.

## 4. `liquidity-pool.clar` (XYK AMC)
- [x] Basic XYK constant product curve logic (STX-FLYRA).
- [x] Implement `liquidity-pool-trait`.
- [x] Provide liquidity & remove liquidity limits.
- [x] Swap logic (`swap-stx-to-token`, `swap-token-to-stx`).
- [x] Capture swap fees and forward to `strategy-token` treasury.

## Verification
- [x] Check standard read-only contract returns using `clarinet check`.
- [ ] Verify functionality via comprehensive tests.
