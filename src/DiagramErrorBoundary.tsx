import React from 'react';

interface DiagramErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | string;
}

interface DiagramErrorBoundaryState {
  hasError: boolean;
}

class DiagramErrorBoundary extends React.Component<DiagramErrorBoundaryProps, DiagramErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Render fallback
      const Fallback = this.props.fallback ? this.props.fallback : 'Error rendering component';
      return <div>{Fallback}</div>;
    }

    return this.props.children;
  }
}

export default DiagramErrorBoundary;
