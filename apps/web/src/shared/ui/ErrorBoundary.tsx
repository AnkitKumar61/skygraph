import { Component, type ReactNode } from "react";

import { StatePanel } from "./States.js";

export class ErrorBoundary extends Component<
  { readonly children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    if (this.state.failed)
      return (
        <main id="main-content">
          <StatePanel
            kind="error"
            headingLevel={1}
            title="The workspace could not open"
            action={
              <button className="button" onClick={() => this.setState({ failed: false })}>
                Try again
              </button>
            }
          >
            An unexpected error interrupted this view. Try opening it again.
          </StatePanel>
        </main>
      );
    return this.props.children;
  }
}
