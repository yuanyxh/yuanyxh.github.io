import { Component } from 'react';

interface ErrorBoundaryProps extends React.DOMAttributes<HTMLDivElement> {}

interface ErrorState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorState> {
  state: ErrorState;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error) {
    console.log(error);

    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>
            {this.state.error?.name}:&nbsp; {this.state.error?.message}
          </h1>

          {this.state.error?.stack
            ?.split(/[\r\n]/)
            .map((value, i) => <p key={i}>{value}</p>)}
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
