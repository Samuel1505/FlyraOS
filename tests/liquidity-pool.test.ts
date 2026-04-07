import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("liquidity-pool tests", () => {
  it("allows providing liquidity", () => {
    const { result } = simnet.callPublicFn("liquidity-pool", "provide-liquidity", [
      Cl.uint(1000000), // stx
      Cl.uint(1000000)  // token
    ], deployer);
    expect(result).toBeOk(Cl.bool(true));

    const pool = simnet.callReadOnlyFn("liquidity-pool", "get-pool-details", [], deployer);
    expect(pool.result).toBeOk(
      Cl.tuple({
        "stx-balance": Cl.uint(1000000),
        "token-balance": Cl.uint(1000000),
        "fee-rate": Cl.uint(3)
      })
    );
  });

  it("allows swapping STX for Token", () => {
    simnet.callPublicFn("liquidity-pool", "provide-liquidity", [
      Cl.uint(1000),
      Cl.uint(1000)
    ], deployer);

    const { result } = simnet.callPublicFn("liquidity-pool", "swap-stx-for-token", [
      Cl.uint(100)
    ], wallet1);
    
    // k = 1000 * 1000 = 1000000
    // new stx = 1100
    // new token = 1000000 / 1100 = 909
    // token out = 1000 - 909 = 91
    expect(result).toBeOk(Cl.uint(91));
  });

  it("allows swapping Token for STX", () => {
    simnet.callPublicFn("liquidity-pool", "provide-liquidity", [
      Cl.uint(1000),
      Cl.uint(1000)
    ], deployer);

    const { result } = simnet.callPublicFn("liquidity-pool", "swap-token-for-stx", [
      Cl.uint(100)
    ], wallet1);

    // new token = 1100
    // new stx = 1000000 / 1100 = 909
    // stx out = 1000 - 909 = 91
    expect(result).toBeOk(Cl.uint(91));
  });

  it("fails swap if insufficient liquidity", () => {
    // pool is empty, swapping will be impossible or return error
    const { result } = simnet.callPublicFn("liquidity-pool", "swap-stx-for-token", [
      Cl.uint(100)
    ], wallet1);
    expect(result).toBeErr(Cl.uint(501)); // ERR-INSUFFICIENT-LIQUIDITY
  });
});
