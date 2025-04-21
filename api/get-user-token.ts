import { ChainType } from "./type";

export type Args = {
    address: string;
    chainType: ChainType;
    signature: string;
}

export const getUserToken = async ({ address, chainType, signature }: Args) => {
    const baseUrl = "https://xc-gateway-staging.jklkjnqscc.com/xc-member/v1/member/register/wallet"
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address,
            chainType,
            signature
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to get user token`);
    }

    const data = await response.json();
    return data;
}