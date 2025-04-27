type AuthenticatedStatus = 'authenticated'
type UnauthenticatedStatus = 'unauthenticated'
type PendingStatus = 'pending'
export type WalletAuthStatus = AuthenticatedStatus | UnauthenticatedStatus | PendingStatus

export type WalletContext = {
    authStatus: WalletAuthStatus;
    address: string | null;
    isConnected: boolean;
    connect: () => Promise<string>;
    disconnect: () => void;
    signMessage: (message: string) => Promise<string>;
    signInBackend: () => Promise<boolean>;
}

export interface TronWeb {
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