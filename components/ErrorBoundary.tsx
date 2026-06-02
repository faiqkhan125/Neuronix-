"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
          <div className="glass-card p-12 max-w-lg w-full text-center border-red-500/20">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h1 className="text-3xl font-black mb-4">Something went wrong</h1>
            <p className="text-white/50 mb-8 leading-relaxed">
              We encountered an unexpected error. Don&apos;t worry, your data is safe. 
              Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-600 transition-all active:scale-95"
              >
                <RefreshCcw size={18} /> Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="flex-1 bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-black/40 rounded-lg text-left overflow-auto max-h-40">
                <p className="text-red-400 text-xs font-mono">{this.state.error?.message}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
