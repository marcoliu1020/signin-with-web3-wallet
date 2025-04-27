'use client'

import { createContext, useContext, useEffect, useState } from 'react';

import TronWeb from 'tronweb';

interface TronWeb {
  ready: boolean;
  defaultAddress: {
    base58: string;
  };
  request: (params: { method: string }) => Promise<{ code: number }>;
  trx: {
    signMessageV2: (message: string) => Promise<string>;
  };
}

// Extend Window interface to include tronWeb
declare global {
  interface Window {
    tronWeb: TronWeb;
  }
}

interface TronContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
}

const TronContext = createContext<TronContextType | null>(null);

export function TronContextProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if already connected
    if (window.tronWeb && window.tronWeb.ready) {
      setAddress(window.tronWeb.defaultAddress.base58);
      setIsConnected(true);
    }

    // Listen for account changes
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleMessage = (event: MessageEvent) => {
    if (event.data.message && event.data.message.action === 'accountsChanged') {
      setAddress(event.data.message.data.address);
    }
  };

  const connect = async () => {
    try {
      if (!window.tronWeb) {
        throw new Error('TronLink not installed');
      }

      const res = await window.tronWeb.request({ method: 'tron_requestAccounts' });
      if (res.code === 200) {
        setAddress(window.tronWeb.defaultAddress.base58);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect to TronLink:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const signMessage = async (message: string) => {
    if (!window.tronWeb || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedMessage = await window.tronWeb.trx.signMessageV2(message);
      return signedMessage;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  };

  return (
    <TronContext.Provider
      value={{
        address,
        isConnected,
        connect,
        disconnect,
        signMessage,
      }}
    >
      {children}
    </TronContext.Provider>
  );
}

export function useTronWallet() {
  const context = useContext(TronContext);
  if (!context) {
    throw new Error('useTronWallet must be used within a TronContextProvider');
  }
  return context;
}