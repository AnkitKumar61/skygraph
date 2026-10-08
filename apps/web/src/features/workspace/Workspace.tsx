import { Link } from "react-router-dom";

import { StatePanel } from "../../shared/ui/States.js";

export function Workspace() {
  return (
    <div className="workspace-grid">
      <section aria-labelledby="workspace-heading">
        <header className="page-heading">
          <h1 id="workspace-heading">Air traffic network lab</h1>
          <p>Explore the network. Understand the decisions.</p>
        </header>
        <StatePanel
          title="Your network workspace is ready"
          action={
            <Link className="button" to="/status">
              Check service status
            </Link>
          }
        >
          Flight data is not connected yet. When a feed is available, this space will show the
          network and its current data state.
        </StatePanel>
        <div className="workspace-note">
          <span className="status-dot" aria-hidden="true" />
          <span>No flight feed connected</span>
        </div>
      </section>
      <aside aria-labelledby="context-heading" className="context-panel">
        <h2 id="context-heading">A place to investigate</h2>
        <p>
          Follow connections between airports, compare routing decisions, and explore how
          disruptions move through a network as these capabilities become available.
        </p>
        <hr />
        <h3>Read the evidence</h3>
        <p>
          Results will distinguish observed data from simulation output, with explicit assumptions
          and algorithm tradeoffs.
        </p>
        <hr />
        <h3>Educational use</h3>
        <p>
          SkyGraph supports learning and simulation. It is not intended for operational navigation
          or air traffic control.
        </p>
      </aside>
    </div>
  );
}
