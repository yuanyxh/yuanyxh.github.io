import { Component, createContext } from 'react';

interface ErrorBoundaryProps extends React.DOMAttributes<HTMLDivElement> {}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryContextValue extends ErrorState {
  reset?(): void;
}

export const ErrorBoundaryContext = createContext<ErrorBoundaryContextValue>({
  hasError: false
});

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorState> {
  state: ErrorState;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(/* error: Error, errorInfo: React.ErrorInfo */) {
    // You can also log the error to an error reporting service
    // console.error(error, errorInfo);
  }

  render() {
    return (
      <ErrorBoundaryContext.Provider value={{ ...this.state, reset: this.reset }}>
        {this.props.children}
      </ErrorBoundaryContext.Provider>
    );
  }
}

export default ErrorBoundary;
