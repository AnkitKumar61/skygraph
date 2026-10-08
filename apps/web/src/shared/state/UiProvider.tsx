import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import { createUiStore, type UiState } from "./ui-store.js";

const UiContext = createContext<ReturnType<typeof createUiStore> | null>(null);
export function UiProvider({ children }: { readonly children: ReactNode }) {
  const [store] = useState(createUiStore);
  return <UiContext.Provider value={store}>{children}</UiContext.Provider>;
}
export function useUiState<T>(selector: (state: UiState) => T): T {
  const store = useContext(UiContext);
  if (store === null) throw new Error("UI state requires UiProvider.");
  return useStore(store, selector);
}
