This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 使用 web3 錢包登入流程

[後端文件](https://ica-gov-tw.sg.larksuite.com/wiki/HURTwoLYKiuDfPkYM5dly2DPgBb?from=from_copylink)

流程：
1. 取得隨機數

    curl --location 'https://xc-gateway-staging.jklkjnqscc.com/xc-member/v1/member/register/challenge?address=Av2vyfdrLdRe2ZaGL5j3qnNXRfYKyVK4dHtqubMHgwK8&chainType=SOLANA'

2. 驗證簽名取得 token (signature 各個錢包簽名會些許不同)

    curl --location 'https://xc-gateway-staging.jklkjnqscc.com/xc-member/v1/member/register/wallet' \
--header 'Content-Type: application/json' \
--header 'nb-business-id: 240053' \
--data '{
    "address": "Av2vyfdrLdRe2ZaGL5j3qnNXRfYKyVK4dHtqubMHgwK8",
    "chainType": "SOLANA",
    "signature": "5A9ytrU7QZTw6JGYjWNhUqZgHmAaSbG8JeCKihyZdAtPFLD7nfGSydRzjLFSfhfq2aHUN26Za44ccvCjHGDLzSPo"
}'

簽名測試
- solana: https://solscan.io/verifiedsignatures
- ethereum: https://etherscan.io/verifiedsignatures#

## Connet with Ethereum wallet

[source](https://wagmi.sh/react/getting-started)

使用 wagmi 整合所有 Ethereum 錢包

## Connect with Solana wallet

[source](https://docs.phantom.com/solana/detecting-the-provider)

直接使用瀏覽器的注入錢包

## Connect with Tron wallet

[source](https://docs-zh.tronlink.org/)

直接使用瀏覽器的注入錢包

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
