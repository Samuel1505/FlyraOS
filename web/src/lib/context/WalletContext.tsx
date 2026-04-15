'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { connect, disconnect } from '@stacks/connect';
import type { GetAddressesResult } from '@stacks/connect/dist/types/methods';

interface WalletState {
  principal: string | null;
  bns: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  walletInfo: any;
}

const WalletContext = createContext<WalletState>({
  principal: null,
  bns: null,
  isConnected: false,
  isLoading: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  walletInfo: null,
});

async function getBnsName(stxAddress: string) {
  try {
    let response = await fetch(`https://api.bnsv2.com/testnet/names/address/${stxAddress}/valid`);
    let data = await response.json();
    if (data && data.names && data.names.length > 0) {
      return data.names[0].full_name;
    }
  } catch (e) {
    console.error('Error fetching BNS:', e);
  }
  return '';
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [bns, setBns] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Derive principal from walletInfo
  const principal = walletInfo?.addresses?.[2]?.address || null;

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      let connectionResponse: GetAddressesResult = await connect();
      let bnsName = await getBnsName(connectionResponse.addresses[2].address);

      setIsConnected(true);
      setWalletInfo(connectionResponse);
      setBns(bnsName);
    } catch (e) {
      console.error('Wallet connection failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    disconnect();
    setIsConnected(false);
    setWalletInfo(null);
    setBns('');
  }, []);

  return (
    <WalletContext.Provider
      value={{
        principal,
        bns,
        isConnected,
        isLoading,
        connectWallet,
        disconnectWallet,
        walletInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletState {
  return useContext(WalletContext);
}
