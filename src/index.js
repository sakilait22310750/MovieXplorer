import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * ErrorBoundary Component
 *
 * Catch-all React class error boundary to catch JavaScript runtime errors
 * anywhere in the child component tree, log them, and display a fallback UI
 * rather than crashing the entire application into a blank white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Updates state so the next render will display the fallback UI.
   *
   * @param {Error} error - The caught error object
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Catches errors from child components and logs stack traces.
   *
   * @param {Error} error - The caught error
   * @param {Object} errorInfo - Component stack trace information
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    // Render fallback error message if an uncaught exception occurred
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ff4d4f', background: '#141414', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ccc' }}>
            <summary style={{ cursor: 'pointer', color: '#E5A00D' }}>Click for error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Render child application as normal
    return this.props.children;
  }
}

// Mount the React application to the DOM root element
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
