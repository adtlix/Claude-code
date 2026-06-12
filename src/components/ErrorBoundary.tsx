import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div className="flex items-center justify-center h-full p-4 text-center">
          <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-red-300 max-w-xs">
            <p className="font-semibold text-sm">Rendering error</p>
            <p className="text-xs mt-1 opacity-60 font-mono">{this.state.error?.message}</p>
            <button
              className="mt-3 text-xs px-3 py-1 rounded bg-red-800/40 hover:bg-red-800/60 transition-colors"
              onClick={() => this.setState({ hasError: false })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
