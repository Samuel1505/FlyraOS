(define-trait liquidity-pool-trait
  (
    (swap-stx-for-token (uint) (response uint uint))
    (swap-token-for-stx (uint) (response uint uint))
    (get-pool-details () (response { stx-balance: uint, token-balance: uint, fee-rate: uint } uint))
  )
)
