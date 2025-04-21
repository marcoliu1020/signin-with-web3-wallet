type GetNonce = (args: { address: string; chainId: number; }) => Promise<string>;
type CreateSignature = (args: { nonce: string; address: string; chainId: number; }) => Promise<string>;
type VerifySignature = (args: { address: string; chainId: number; signature: string; }) => Promise<boolean>;
type SignOut = () => Promise<void>;

export interface AuthenticationAdapter {
    getNonce: GetNonce;
    createSignature: CreateSignature;
    verifySignature: VerifySignature;
    signOut: SignOut;
}

export const signInPipeWork =
    (address: string, chainId: number) =>
        async (adapter: AuthenticationAdapter) => {
            const nonce = await adapter.getNonce({ address, chainId });
            const signature = await adapter.createSignature({ nonce, address, chainId });
            const isVerified = await adapter.verifySignature({ signature, address, chainId });
            if (!isVerified) {
                return { error: 'Signature verification failed', success: false };
            }
            return { error: "", success: true, signOut: adapter.signOut };
        }