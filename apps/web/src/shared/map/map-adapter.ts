import type { FlightPosition } from "../live/live-flight-store.js";
import type { Viewport } from "../state/ui-store.js";

export interface MapAdapter {
  setViewport(viewport: Viewport): void;
  updatePositions(positions: readonly FlightPosition[]): void;
  destroy(): void;
}
