import React from 'react';

export default class FallbackRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Field rendering crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 border border-accent-danger/50 bg-accent-danger/10 rounded-lg">
          <p className="text-sm font-semibold text-accent-danger">Failed to render field.</p>
          <p className="text-xs text-accent-danger/80 mt-1 font-mono break-all">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
