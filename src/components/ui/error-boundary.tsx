"use client"

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-dark-panel border border-dark-border rounded-xl">
    <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
    <h2 className="text-xl font-bold text-dark-primary mb-2">Something went wrong</h2>
    <p className="text-dark-secondary mb-6 max-w-md">
      We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
    </p>
    <div className="space-y-2">
      <Button onClick={resetError} className="bg-dark-accent hover:bg-dark-accent/90">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
      <details className="mt-4">
        <summary className="text-sm text-dark-secondary cursor-pointer hover:text-dark-primary">
          Technical Details
        </summary>
        <pre className="mt-2 p-4 bg-dark-background rounded-lg text-xs text-red-400 overflow-auto max-w-md">
          {error.message}
        </pre>
      </details>
    </div>
  </div>
)

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

export { ErrorBoundary, DefaultErrorFallback }
export type { ErrorBoundaryProps, ErrorFallbackProps } 