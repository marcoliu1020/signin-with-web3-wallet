'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// evm
import { EVMContextProvider } from "./evm";

const queryClient = new QueryClient()

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <EVMContextProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </EVMContextProvider>
  )
}
