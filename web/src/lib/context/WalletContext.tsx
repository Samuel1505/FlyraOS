'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { APP_NAME, APP_ICON_URL, STACKS_NETWORK } from '@/config';

interface WalletState {
  principal: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState>({
  principal: null,
  isConnected: false,
  isLoading: false,
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('flyraos_principal');
    if (stored) setPrincipal(stored);
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      const { showConnect } = await import('@stacks/connect');
      showConnect({
        appDetails: { name: APP_NAME, icon: APP_ICON_URL },
        onFinish: ({ userSession }) => {
          const userData = userSession.loadUserData();
          const addr =
            STACKS_NETWORK === 'mainnet'
              ? userData.profile.stxAddress.mainnet
              : userData.profile.stxAddress.testnet;
          setPrincipal(addr);
          localStorage.setItem('flyraos_principal', addr);
          setIsLoading(false);
        },
        onCancel: () => setIsLoading(false),
      });
    } catch {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPrincipal(null);
    localStorage.removeItem('flyraos_principal');
  }, []);

  return (
    <WalletContext.Provider
      value={{ principal, isConnected: !!principal, isLoading, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletState {
  return useContext(WalletContext);
}
