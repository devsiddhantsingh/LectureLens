import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem', color: '#fff', background: '#0f172a',
                    minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <p style={{ color: '#94a3b8', maxWidth: '600px', marginBottom: '2rem' }}>
                        The application encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <div style={{
                        background: '#1e293b', padding: '1.5rem', borderRadius: '8px',
                        textAlign: 'left', maxWidth: '800px', overflow: 'auto',
                        border: '1px solid #334155', fontFamily: 'monospace', fontSize: '0.85rem'
                    }}>
                        <p style={{ color: '#ef4444', marginBottom: '0.5rem' }}>{this.state.error && this.state.error.toString()}</p>
                        <pre style={{ color: '#94a3b8' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem', padding: '0.8rem 1.5rem',
                            background: '#3b82f6', color: '#fff', border: 'none',
                            borderRadius: '6px', cursor: 'pointer', fontSize: '1rem'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
