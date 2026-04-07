import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("nft-marketplace tests", () => {
  it("allows listing an NFT", () => {
    // Mint NFT first
    simnet.callPublicFn("funny-dog", "mint", [Cl.standardPrincipal(wallet1)], deployer);

    // List NFT
    const { result } = simnet.callPublicFn("nft-marketplace", "list-in-ustx", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1),
      Cl.uint(1000000)
    ], wallet1);
    expect(result).toBeOk(Cl.bool(true));
    
    // Check owner is now marketplace
    const owner = simnet.callReadOnlyFn("funny-dog", "get-owner", [Cl.uint(1)], deployer);
    expect(owner.result).toBeOk(Cl.some(Cl.contractPrincipal(deployer, "nft-marketplace")));
  });

  it("allows cancelling a listing", () => {
    simnet.callPublicFn("funny-dog", "mint", [Cl.standardPrincipal(wallet1)], deployer);
    simnet.callPublicFn("nft-marketplace", "list-in-ustx", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1),
      Cl.uint(1000000)
    ], wallet1);

    const { result } = simnet.callPublicFn("nft-marketplace", "cancel-listing", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1)
    ], wallet1);
    expect(result).toBeOk(Cl.bool(true));

    // Check owner is back to wallet1
    const owner = simnet.callReadOnlyFn("funny-dog", "get-owner", [Cl.uint(1)], deployer);
    expect(owner.result).toBeOk(Cl.some(Cl.standardPrincipal(wallet1)));
  });

  it("prevents non-maker from cancelling", () => {
    simnet.callPublicFn("funny-dog", "mint", [Cl.standardPrincipal(wallet1)], deployer);
    simnet.callPublicFn("nft-marketplace", "list-in-ustx", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1),
      Cl.uint(1000000)
    ], wallet1);

    const { result } = simnet.callPublicFn("nft-marketplace", "cancel-listing", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1)
    ], wallet2);
    expect(result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED
  });

  it("allows buying an NFT", () => {
    simnet.callPublicFn("funny-dog", "mint", [Cl.standardPrincipal(wallet1)], deployer);
    simnet.callPublicFn("nft-marketplace", "list-in-ustx", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1),
      Cl.uint(1000000)
    ], wallet1);

    const { result } = simnet.callPublicFn("nft-marketplace", "buy-in-ustx", [
      Cl.contractPrincipal(deployer, "funny-dog"),
      Cl.uint(1)
    ], wallet2);
    expect(result).toBeOk(Cl.bool(true));

    // Check owner is now wallet2
    const owner = simnet.callReadOnlyFn("funny-dog", "get-owner", [Cl.uint(1)], deployer);
    expect(owner.result).toBeOk(Cl.some(Cl.standardPrincipal(wallet2)));
  });
});
