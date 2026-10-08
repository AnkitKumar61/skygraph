import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Application } from "./app/Application.js";
import "./shared/ui/styles.css";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("Application root was not found.");
}
createRoot(root).render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
