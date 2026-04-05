;; title: strategy-token
;; summary: SIP-010 FT token (FLYRA) with treasury logic, relisting rules, swap-triggered burns.
(impl-trait .sip-010-trait.sip-010-trait)
(use-trait nft-trait .nft-trait.nft-trait)

(define-fungible-token flyra)

(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-INVALID-AMOUNT (err u403))
(define-constant ERR-INVALID-RECIPIENT (err u404))

(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var contract-owner principal tx-sender)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq sender recipient)) ERR-INVALID-RECIPIENT)
    (match (ft-transfer? flyra amount sender recipient)
      response (begin
        (print memo)
        (ok response)
      )
      error (err error)
    )
  )
)

(define-read-only (get-name)
  (ok "FLYRA Strategy Token")
)

(define-read-only (get-symbol)
  (ok "FLYRA")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance flyra who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply flyra))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; admin minting
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq recipient (as-contract tx-sender))) ERR-INVALID-RECIPIENT)
    (ft-mint? flyra amount recipient)
  )
)

;; treasury func to sweep/relist NFTs
(define-public (sweep-and-relist (nft-contract <nft-trait>) (token-id uint))
  (begin
    ;; Simplified placeholder for sweeping floor and relisting logic
    (ok true)
  )
)

;; swap-triggered burns (anyone can burn their flyra or pool calls it)
(define-public (burn (amount uint))
  (begin
    (ft-burn? flyra amount tx-sender)
  )
)

;; Allows strategy to receive fees directly
(define-public (receive-fees (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (ft-mint? flyra amount tx-sender) ;; placeholder for fee mechanics
  )
)
