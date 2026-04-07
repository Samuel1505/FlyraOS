import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("funny-dog tests", () => {
  it("allows minting and returns correct token id", () => {
    const { result } = simnet.callPublicFn("funny-dog", "mint", [Cl.standardPrincipal(wallet1)], deployer);
    // expect result to be (ok u1)
    expect(result).toBeOk(Cl.uint(1));
    
    // Check total minted
    const lastTokenIdOption = simnet.callReadOnlyFn("funny-dog", "get-last-token-id", [], deployer);
    expect(lastTokenIdOption.result).toBeOk(Cl.uint(1));
  });

  it("fails to mint to contract", () => {
    const { result } = simnet.callPublicFn("funny-dog", "mint", [Cl.contractPrincipal(deployer, "funny-dog")], deployer);
    expect(result).toBeErr(Cl.uint(403)); // ERR-INVALID-RECIPIENT
  });

  it("can transfer after minting", () => {
    simnet.callPublicFn("funny-dog", "mint", [Cl.standardPrincipal(wallet1)], deployer);
    const { result } = simnet.callPublicFn("funny-dog", "transfer", [Cl.uint(1), Cl.standardPrincipal(wallet1), Cl.standardPrincipal(wallet2)], wallet1);
    expect(result).toBeOk(Cl.bool(true));

    const owner = simnet.callReadOnlyFn("funny-dog", "get-owner", [Cl.uint(1)], deployer);
    expect(owner.result).toBeOk(Cl.some(Cl.standardPrincipal(wallet2)));
  });

  it("allows owner to set base uri", () => {
    const { result } = simnet.callPublicFn("funny-dog", "set-base-uri", [Cl.stringAscii("ipfs://new/hash/")], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("prevents non-owner from setting base uri", () => {
    const { result } = simnet.callPublicFn("funny-dog", "set-base-uri", [Cl.stringAscii("ipfs://new/hash/")], wallet1);
    expect(result).toBeErr(Cl.uint(401));
  });
});
