import { signMessage } from '@wagmi/core';
import { config } from './config';

// api
import { getNonce } from '@/api/get-nonce';
import { getUserToken } from '@/api/get-user-token';

// type
import type { AuthenticationAdapter } from "../signin-pipe-work";

export const evmAuthFlow: AuthenticationAdapter = {
    getNonce: async ({ address }) => {
      const nonce = await getNonce({ address, chainType: 'ETHEREUM' }); // metamask 都是 ethereum
      return nonce;
    },
    createSignature: async ({ nonce }) => {
      // 可以用這個網站測試 https://etherscan.io/verifiedSignatures#
      const signature = await signMessage(config, { message: nonce });
      return signature;
    },
    verifySignature: async ({ address, signature }) => {
      const userToken = await getUserToken({ address, chainType: 'ETHEREUM', signature }); // metamask 都是 ethereum
      // TODO: 儲存 userToken
      sessionStorage.setItem('userToken', userToken.data.token)
      console.log('userToken', userToken)
      return userToken.data.isSuccess;
    },
    signOut: async () => {
      // TODO: Implement sign out
    }
  }