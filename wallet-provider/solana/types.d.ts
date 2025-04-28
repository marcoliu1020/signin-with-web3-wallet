import { PublicKey } from '@solana/web3.js';

declare global {
    interface Window {
        solana?: {
            isConnected: boolean;
            publicKey: PublicKey | null;
            connect: () => Promise<{ publicKey: PublicKey }>;
            disconnect: () => Promise<void>;
            signMessage: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
            on: (event: string, callback: (publicKey: PublicKey | null) => void) => void;
            removeAllListeners: () => void;
        };
    }
}

export interface PhantomProvider {
    isConnected: boolean;
    publicKey: PublicKey | null;
    connect: () => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    signMessage: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
    on: (event: string, callback: (publicKey: PublicKey | null) => void) => void;
    removeAllListeners: () => void;
} 