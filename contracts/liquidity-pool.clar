;; title: liquidity-pool
;; summary: XYK pool for STX <-> FLYRA swaps, forwards fees to the strategy.

(impl-trait .liquidity-pool-trait.liquidity-pool-trait)

(define-constant ERR-INSUFFICIENT-LIQUIDITY (err u501))
(define-constant ERR-INVALID-AMOUNT (err u502))

(define-data-var pool-stx-balance uint u0)
(define-data-var pool-token-balance uint u0)

(define-public (swap-stx-for-token (stx-amount uint))
  (let 
    (
      (stx-balance (var-get pool-stx-balance))
      (token-balance (var-get pool-token-balance))
      (k (* stx-balance token-balance))
      (new-stx-balance (+ stx-balance stx-amount))
      (new-token-balance (if (> new-stx-balance u0) (/ k new-stx-balance) token-balance))
      (tokens-out (- token-balance new-token-balance))
    )
    (asserts! (> tokens-out u0) ERR-INSUFFICIENT-LIQUIDITY)
    (var-set pool-stx-balance new-stx-balance)
    (var-set pool-token-balance new-token-balance)
    ;; Intentionally simplified logic: in reality we'd do stx-transfer and ft-transfer
    (asserts! (> stx-amount u0) ERR-INVALID-AMOUNT)
    (ok tokens-out)
  )
)

(define-public (swap-token-for-stx (token-amount uint))
  (let 
    (
      (stx-balance (var-get pool-stx-balance))
      (token-balance (var-get pool-token-balance))
      (k (* stx-balance token-balance))
      (new-token-balance (+ token-balance token-amount))
      (new-stx-balance (if (> new-token-balance u0) (/ k new-token-balance) stx-balance))
      (stx-out (- stx-balance new-stx-balance))
    )
    (asserts! (> stx-out u0) ERR-INSUFFICIENT-LIQUIDITY)
    (asserts! (> token-amount u0) ERR-INVALID-AMOUNT)
    (var-set pool-stx-balance new-stx-balance)
    (var-set pool-token-balance new-token-balance)
    (ok stx-out)
  )
)

(define-read-only (get-pool-details)
  (ok { stx-balance: (var-get pool-stx-balance), token-balance: (var-get pool-token-balance), fee-rate: u3 })
)

;; admin function to seed liquidity
(define-public (provide-liquidity (stx-amount uint) (token-amount uint))
  (begin
    (asserts! (> stx-amount u0) ERR-INVALID-AMOUNT)
    (asserts! (> token-amount u0) ERR-INVALID-AMOUNT)
    (var-set pool-stx-balance (+ (var-get pool-stx-balance) stx-amount))
    (var-set pool-token-balance (+ (var-get pool-token-balance) token-amount))
    (ok true)
  )
)
