;; title: funny-dog
;; summary: SIP-009 NFT collection with sequential minting, URI builder, and collection cap.

(impl-trait .nft-trait.nft-trait)

(define-non-fungible-token funny-dog uint)

;; Constants
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-MAX-MINTED (err u402))
(define-constant ERR-INVALID-RECIPIENT (err u403))
(define-constant ERR-INVALID-TOKEN (err u404))
(define-constant ERR-INVALID-URI (err u405))
(define-constant COLLECTION-CAP u10000)

;; Data Vars
(define-data-var last-token-id uint u0)
(define-data-var base-uri (string-ascii 256) "ipf://ipfs/hash/")
(define-data-var contract-owner principal tx-sender)

;; SIP-009 trait functions
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (some (var-get base-uri))) ;; simplified for demo, in reality would append token-id
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? funny-dog token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (> token-id u0) ERR-INVALID-TOKEN)
    (asserts! (not (is-eq sender recipient)) ERR-INVALID-RECIPIENT)
    (nft-transfer? funny-dog token-id sender recipient)
  )
)

;; Minting function
(define-public (mint (recipient principal))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (not (is-eq recipient (as-contract tx-sender))) ERR-INVALID-RECIPIENT)
    (asserts! (<= token-id COLLECTION-CAP) ERR-MAX-MINTED)
    (try! (nft-mint? funny-dog token-id recipient))
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

;; Admin functions
(define-public (set-base-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (> (len new-uri) u0) ERR-INVALID-URI)
    (var-set base-uri new-uri)
    (ok true)
  )
)
