import {
  makeContractCall,
  broadcastTransaction,
  standardPrincipalCV,
  uintCV,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';

// We use the Mainnet network as requested
const network = STACKS_MAINNET;

// Deployer address provided by user
const deployerAddress = 'SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF';

async function main() {
  // Pass the mnemonic phrase here instead of the hex private key
  const SENDER_MNEMONIC = process.env.SENDER_KEY;

  if (!SENDER_MNEMONIC) {
    console.error("❌ Missing SENDER_KEY environment variable!");
    console.error("Usage: SENDER_KEY=\"your twenty four word mnemonic phrase here\" npx tsx scripts/farm-txs.ts");
    process.exit(1);
  }

  console.log("Deriving private key from mnemonic...");
  
  // Generate wallet from mnemonic
  const wallet = await generateWallet({
    secretKey: SENDER_MNEMONIC,
    password: 'password' // A generic password as we don't store the encrypted wallet
  });

  // Since generateWallet generates only 1 account by default, account 0 is wallet.accounts[0]
  const SENDER_KEY = wallet.accounts[0].stxPrivateKey;

  const senderAddress = getAddressFromPrivateKey(SENDER_KEY, "mainnet");

  console.log(`🌾 Starting farming script for address: ${senderAddress}`);

  let currentNonce = await getCurrentNonce(senderAddress);
  console.log(`🚀 Starting with nonce: ${currentNonce}`);

  // Define the list of smart contract functions to randomly/sequentially interact with.
  const actions = [
    {
      contractName: 'funny-dog',
      functionName: 'mint',
      functionArgs: [standardPrincipalCV(senderAddress)]
    },
    {
      contractName: 'liquidity-pool',
      functionName: 'swap-stx-for-token',
      functionArgs: [uintCV(1000)] // swap 1000 uSTX
    },
    {
      contractName: 'liquidity-pool',
      functionName: 'swap-token-for-stx',
      functionArgs: [uintCV(1000)] // swap 1000 token
    },
    {
      contractName: 'liquidity-pool',
      functionName: 'provide-liquidity',
      functionArgs: [uintCV(1000), uintCV(1000)] // add small amounts of liquidity
    }
  ];

  let actionIndex = 0;

  console.log("Press Ctrl+C to stop the terminal and end the looping... \n");

  while (true) {
    const action = actions[actionIndex % actions.length];
    
    console.log(`\n⏳ Crafting Tx (Nonce: ${currentNonce}): ${deployerAddress}.${action.contractName} -> ${action.functionName}`);
    
    try {
      const txOptions = {
        contractAddress: deployerAddress,
        contractName: action.contractName,
        functionName: action.functionName,
        functionArgs: action.functionArgs,
        senderKey: SENDER_KEY as string,
        validateWithAbi: false,
        network,
        postConditionMode: PostConditionMode.Allow, // Allows changing any state, careful with this on mainnet with real funds!
        anchorMode: AnchorMode.Any,
        nonce: currentNonce,
        fee: 5000 // 5000 uSTX transaction fee. Could be dynamically set.
      };

      // 1. Make the contract call transaction
      const transaction = await makeContractCall(txOptions);
      
      // 2. Broadcast the transaction
      const broadcastResponse = await broadcastTransaction({ transaction, network });

      if ('error' in broadcastResponse) {
        console.error(`❌ Broadcast failed: ${broadcastResponse.reason} - ${broadcastResponse.error}`);
        // If nonce error or other error, delay a bit and refetch nonce
        console.log("Retrying in 10 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        currentNonce = await getCurrentNonce(senderAddress); 
      } else {
        console.log(`✅ Tx published! TxID: ${broadcastResponse.txid}`);
        // Locally increment nonce for the next immediate transaction without waiting for block confirmation
        currentNonce++; 
      }
    } catch (error) {
      console.error(`❌ Error creating/broadcasting transaction:`, error);
    }

    actionIndex++;
    
    // Configurable delay (e.g. 5000 ms) before the next tx
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

async function getCurrentNonce(senderAddress: string) {
  const url = `${network.client.baseUrl}/v2/accounts/${senderAddress}?proof=0`;
  const res = await fetch(url);
  const data = await res.json();
  return data.nonce;
}

main().catch(console.error);
