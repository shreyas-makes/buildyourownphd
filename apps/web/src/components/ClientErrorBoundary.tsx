'use client'

import { ErrorBoundary } from './ErrorBoundary'

interface ClientErrorBoundaryProps {
  children: React.ReactNode
}

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>
} 