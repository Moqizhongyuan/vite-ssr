import React, { ErrorInfo, ReactNode } from "react";

// 显式声明组件的 props 类型，确保 children 类型被包含
interface ErrorBoundaryProps {
  children: ReactNode; // ReactNode 表示任何可以作为 React 子元素的内容
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 你可以将错误信息记录到外部服务
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    console.log("objectaaaaa");

    return this.props.children;
  }
}

export default ErrorBoundary;
