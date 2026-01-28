'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

type Props = {children: React.ReactNode}

// const client = new QueryClient()

const ReactQueryProvider = ({ children}: Props) => {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  }))
  return (
    <QueryClientProvider client={client}>
        {children}

        {/* {process.env.NODE_ENV === 'development' && <ReatQueryDevtools initialOpen={false} />} */}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider;