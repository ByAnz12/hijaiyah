import { Component } from 'react';

// Menangkap error (mis. WebGL gagal) agar layar tidak pernah blank.
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) {
    console.warn('[Hurufku3D] fallback aktif:', err);
    this.props.onError?.(err);
  }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children; }
}
