import { ChainType } from "./type";

export type GetNonceParams = {
    address: string;
    chainType: ChainType
}

export const getNonce = async ({ address, chainType }: GetNonceParams): Promise<string> => {
    const baseUrl = "https://xc-gateway-staging.jklkjnqscc.com/xc-member/v1/member/register/challenge"
    const searchParams = new URLSearchParams({ address, chainType });
    const response = await fetch(`${baseUrl}?${searchParams.toString()}`);
    
    if (!response.ok) {
        throw new Error(`Failed to get nonce`);
    }

    const data = await response.json();
    return data.data.messageToSign || '';
}