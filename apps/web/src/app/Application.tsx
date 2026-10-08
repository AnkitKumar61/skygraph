import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";

import { Workspace } from "../features/workspace/Workspace.js";
import { ServiceStatus } from "../features/status/ServiceStatus.js";
import { createQueryClient } from "../shared/api/query-client.js";
import { LiveFlightProvider } from "../shared/live/LiveFlightProvider.js";
import { UiProvider } from "../shared/state/UiProvider.js";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary.js";
import { StatePanel } from "../shared/ui/States.js";

export function ApplicationRoutes() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="app-shell">
        <header className="navigation-rail">
          <Link className="brand" to="/" aria-label="SkyGraph workspace">
            <span>SkyGraph</span>
          </Link>
          <nav aria-label="Primary">
            <NavLink end to="/">
              Workspace
            </NavLink>
            <NavLink to="/status">Service status</NavLink>
          </nav>
          <p className="rail-footer">
            Global networks.
            <br />
            Clearer decisions.
          </p>
        </header>
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Workspace />} />
            <Route path="/status" element={<ServiceStatus />} />
            <Route
              path="*"
              element={
                <StatePanel
                  title="This view does not exist"
                  action={
                    <Link className="button" to="/">
                      Return to workspace
                    </Link>
                  }
                >
                  Choose a workspace view using the navigation.
                </StatePanel>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
}
export function Application() {
  const [queryClient] = useState(createQueryClient);
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UiProvider>
          <LiveFlightProvider>
            <BrowserRouter>
              <ApplicationRoutes />
            </BrowserRouter>
          </LiveFlightProvider>
        </UiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
