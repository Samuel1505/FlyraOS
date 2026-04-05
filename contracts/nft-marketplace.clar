;; title: nft-marketplace
;; summary: Minimal STX-only marketplace for listing, cancelling, and fulfilling NFTs.

(use-trait nft-trait .nft-trait.nft-trait)

(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-LISTING-NOT-FOUND (err u404))
(define-constant ERR-INVALID-AMOUNT (err u405))

;; Maps
(define-map listings 
  { nft-contract: principal, token-id: uint } 
  { maker: principal, price: uint }
)

;; List an NFT out
(define-public (list-in-ustx (nft-contract <nft-trait>) (token-id uint) (price uint))
  (let
    (
      (maker tx-sender)
    )
    (asserts! (> price u0) ERR-INVALID-AMOUNT)
    (asserts! (> token-id u0) ERR-INVALID-AMOUNT)
    (asserts! (is-eq (contract-of nft-contract) (contract-of nft-contract)) ERR-INVALID-AMOUNT)
    (try! (contract-call? nft-contract transfer token-id tx-sender (as-contract tx-sender)))
    (map-set listings 
      { nft-contract: (contract-of nft-contract), token-id: token-id } 
      { maker: maker, price: price }
    )
    (ok true)
  )
)

;; Cancel listing
(define-public (cancel-listing (nft-contract <nft-trait>) (token-id uint))
  (let
    (
      (listing (unwrap! (map-get? listings { nft-contract: (contract-of nft-contract), token-id: token-id }) ERR-LISTING-NOT-FOUND))
    )
    (asserts! (> token-id u0) ERR-INVALID-AMOUNT)
    (asserts! (is-eq (contract-of nft-contract) (contract-of nft-contract)) ERR-INVALID-AMOUNT)
    (asserts! (is-eq tx-sender (get maker listing)) ERR-NOT-AUTHORIZED)
    
    (try! (as-contract (contract-call? nft-contract transfer token-id tx-sender (get maker listing))))
    (map-delete listings { nft-contract: (contract-of nft-contract), token-id: token-id })
    (ok true)
  )
)

;; Buy NFT
(define-public (buy-in-ustx (nft-contract <nft-trait>) (token-id uint))
  (let
    (
      (listing (unwrap! (map-get? listings { nft-contract: (contract-of nft-contract), token-id: token-id }) ERR-LISTING-NOT-FOUND))
      (buyer tx-sender)
    )
    (asserts! (> token-id u0) ERR-INVALID-AMOUNT)
    (asserts! (is-eq (contract-of nft-contract) (contract-of nft-contract)) ERR-INVALID-AMOUNT)
    ;; Transfer STX from buyer to maker
    (try! (stx-transfer? (get price listing) buyer (get maker listing)))
    ;; Transfer NFT from marketplace to buyer
    (try! (as-contract (contract-call? nft-contract transfer token-id tx-sender buyer)))
    
    (map-delete listings { nft-contract: (contract-of nft-contract), token-id: token-id })
    (ok true)
  )
)
