type GetNonce = (args: { address: string; chainId: number; }) => Promise<string>;
type CreateSignature = (args: { nonce: string; address: string; chainId: number; }) => Promise<string>;
type VerifySignature = (args: { address: string; chainId: number; signature: string; }) => Promise<boolean>;
type SignOut = () => Promise<void>;

/**
 * 認證適配器
 */
export interface AuthenticationAdapter {
    /** 取得 nonce */
    getNonce: GetNonce;
    /** 建立簽名 */
    createSignature: CreateSignature;
    /** 驗證簽名 */
    verifySignature: VerifySignature;
    /** 登出 */
    signOut: SignOut;
}

/**
 * web3 錢包登入流程
 * @param address 地址
 * @param chainId 鏈ID
 * @param adapter 認證適配器
 * @returns 登入結果
 */
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