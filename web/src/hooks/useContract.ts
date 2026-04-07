'use client';

import { useCallback, useState } from 'react';
import { useWallet } from '@/lib/context/WalletContext';
import {
  NFT_MARKETPLACE_ADDRESS,
  STRATEGY_TOKEN_ADDRESS,
  STACKS_NETWORK,
} from '@/config';

type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export function useContract() {
  const { principal } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);

  const execTx = useCallback(
    async (fn: () => Promise<{ txid: string }>) => {
      if (!principal) throw new Error('Wallet not connected');
      setIsLoading(true);
      setTxStatus('pending');
      try {
        const { txid } = await fn();
        setTxId(txid);
        setTxStatus('success');
        return txid;
      } catch (err) {
        setTxStatus('error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [principal],
  );

  const buyNFT = useCallback(
    async (nftContractAddress: string, tokenId: number, price: number) => {
      const { openContractCall } = await import('@stacks/connect');
      const { uintCV, contractPrincipalCV, PostConditionMode } = await import(
        '@stacks/transactions'
      );
      return execTx(() =>
        new Promise<{ txid: string }>((resolve, reject) => {
          openContractCall({
            contractAddress: NFT_MARKETPLACE_ADDRESS,
            contractName: 'nft-marketplace',
            functionName: 'buy-in-ustx',
            functionArgs: [
              contractPrincipalCV(
                nftContractAddress.split('.')[0],
                nftContractAddress.split('.')[1] ?? 'nft-marketplace',
              ),
              uintCV(tokenId),
            ],
            postConditionMode: PostConditionMode.Allow,
            network: STACKS_NETWORK,
            onFinish: ({ txId: id }) => resolve({ txid: id }),
            onCancel: () => reject(new Error('Cancelled')),
          });
        })
      );
    },
    [execTx],
  );

  const burnFLYRA = useCallback(
    async (amount: number) => {
      const { openContractCall } = await import('@stacks/connect');
      const { uintCV, PostConditionMode } = await import('@stacks/transactions');
      return execTx(() =>
        new Promise<{ txid: string }>((resolve, reject) => {
          openContractCall({
            contractAddress: STRATEGY_TOKEN_ADDRESS,
            contractName: 'strategy-token',
            functionName: 'burn',
            functionArgs: [uintCV(amount)],
            postConditionMode: PostConditionMode.Allow,
            network: STACKS_NETWORK,
            onFinish: ({ txId: id }) => resolve({ txid: id }),
            onCancel: () => reject(new Error('Cancelled')),
          });
        })
      );
    },
    [execTx],
  );

  const floorSweep = useCallback(
    async (nftContractAddress: string, tokenId: number) => {
      const { openContractCall } = await import('@stacks/connect');
      const { uintCV, contractPrincipalCV, PostConditionMode } = await import(
        '@stacks/transactions'
      );
      return execTx(() =>
        new Promise<{ txid: string }>((resolve, reject) => {
          openContractCall({
            contractAddress: STRATEGY_TOKEN_ADDRESS,
            contractName: 'strategy-token',
            functionName: 'sweep-and-relist',
            functionArgs: [
              contractPrincipalCV(
                nftContractAddress.split('.')[0],
                nftContractAddress.split('.')[1] ?? 'nft-marketplace',
              ),
              uintCV(tokenId),
            ],
            postConditionMode: PostConditionMode.Allow,
            network: STACKS_NETWORK,
            onFinish: ({ txId: id }) => resolve({ txid: id }),
            onCancel: () => reject(new Error('Cancelled')),
          });
        })
      );
    },
    [execTx],
  );

  return { buyNFT, burnFLYRA, floorSweep, isLoading, txStatus, txId };
}
