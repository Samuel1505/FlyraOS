import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("strategy-token tests", () => {
  it("allows owner to mint", () => {
    const { result } = simnet.callPublicFn("strategy-token", "mint", [Cl.uint(1000000), Cl.standardPrincipal(wallet1)], deployer);
    expect(result).toBeOk(Cl.bool(true));

    // Check balance
    const balance = simnet.callReadOnlyFn("strategy-token", "get-balance", [Cl.standardPrincipal(wallet1)], deployer);
    expect(balance.result).toBeOk(Cl.uint(1000000));
  });

  it("prevents non-owner from minting", () => {
    const { result } = simnet.callPublicFn("strategy-token", "mint", [Cl.uint(1000000), Cl.standardPrincipal(wallet2)], wallet1);
    expect(result).toBeErr(Cl.uint(401));
  });

  it("allows token transfer", () => {
    simnet.callPublicFn("strategy-token", "mint", [Cl.uint(1000000), Cl.standardPrincipal(wallet1)], deployer);
    const { result } = simnet.callPublicFn("strategy-token", "transfer", [
      Cl.uint(500000),
      Cl.standardPrincipal(wallet1),
      Cl.standardPrincipal(wallet2),
      Cl.none()
    ], wallet1);
    expect(result).toBeOk(Cl.bool(true));

    const balance1 = simnet.callReadOnlyFn("strategy-token", "get-balance", [Cl.standardPrincipal(wallet1)], deployer);
    expect(balance1.result).toBeOk(Cl.uint(500000));

    const balance2 = simnet.callReadOnlyFn("strategy-token", "get-balance", [Cl.standardPrincipal(wallet2)], deployer);
    expect(balance2.result).toBeOk(Cl.uint(500000));
  });

  it("allows burning tokens", () => {
    simnet.callPublicFn("strategy-token", "mint", [Cl.uint(1000000), Cl.standardPrincipal(wallet1)], deployer);
    const { result } = simnet.callPublicFn("strategy-token", "burn", [Cl.uint(500000)], wallet1);
    expect(result).toBeOk(Cl.bool(true));

    const balance = simnet.callReadOnlyFn("strategy-token", "get-balance", [Cl.standardPrincipal(wallet1)], deployer);
    expect(balance.result).toBeOk(Cl.uint(500000));
  });

  it("allows receiving fees", () => {
    const { result } = simnet.callPublicFn("strategy-token", "receive-fees", [Cl.uint(1000)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });
});
