FlyraOS is a project built on Stacks blockchain using Clarity smart contracts, demonstrating an on-chain perpetual NFT treasury flywheel — a self-sustaining loop where marketplace activity funds automated floor sweeps, premium relists, and token burns. Designed for autonomy and transparency, the protocol showcases how perpetual strategies can compound value entirely on-chain without custodial control.

Contracts overview
funny-dog.clar – SIP-009 NFT collection with sequential minting, URI builder, and collection cap.
nft-marketplace.clar – Minimal STX-only marketplace for listing, cancelling, and fulfilling NFTs.
strategy-token.clar – SIP-010 fungible token (FLYRA) plus treasury logic, NFT relisting, and swap-triggered burns.
liquidity-pool.clar – XYK pool for STX⇄FLYRA swaps, captures swap fees and forwards them to the strategy.
traits/liquidity-pool-trait.clar – Trait shared between strategy contract and pool.
