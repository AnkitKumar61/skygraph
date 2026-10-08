import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

export interface Viewport {
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
}
export interface UiState {
  readonly selectedAlgorithm: "dijkstra" | "astar";
  readonly viewport: Viewport;
  readonly simulationPanelOpen: boolean;
  selectAlgorithm(algorithm: UiState["selectedAlgorithm"]): void;
  setViewport(viewport: Viewport): void;
  setSimulationPanelOpen(open: boolean): void;
}

export function createUiStore() {
  return createStore<UiState>()(
    subscribeWithSelector((set) => ({
      selectedAlgorithm: "dijkstra",
      viewport: { latitude: 20, longitude: 0, zoom: 2 },
      simulationPanelOpen: false,
      selectAlgorithm: (selectedAlgorithm) => set({ selectedAlgorithm }),
      setViewport: (viewport) => {
        if (
          !Number.isFinite(viewport.latitude) ||
          Math.abs(viewport.latitude) > 90 ||
          !Number.isFinite(viewport.longitude) ||
          Math.abs(viewport.longitude) > 180 ||
          !Number.isFinite(viewport.zoom) ||
          viewport.zoom < 0 ||
          viewport.zoom > 22
        ) {
          throw new RangeError("Map viewport is invalid.");
        }
        set({ viewport: Object.freeze({ ...viewport }) });
      },
      setSimulationPanelOpen: (simulationPanelOpen) => set({ simulationPanelOpen }),
    })),
  );
}
