# Lessons Learned

- **Clarinet Configuration**: Setting `clarity_version = 4` inside `Clarinet.toml` is invalid and can cause the Clarinet parser to fallback or produce bizarre syntactical errors, such as labeling standard expressions like `(as-contract tx-sender)` as an "unresolved function 'as-contract'". Always use `clarity_version = 3` (or lower like 2 for legacy compatibility) as that is currently the maximum supported by Stacks Nakamoto/Clarinet.

- **Missing local traits format**: Using remote `contract_id` formats in `[requirements]` might result in "malformatted contract_id" when using offline `clarinet check` depending on the environment. It's often safer and simpler to define `sip-010` and `nft-trait` as local files for rapid build validation unless using the native Clarinet remote dependencies proxy.
