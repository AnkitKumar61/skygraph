import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { createLiveFlightStore, type LiveFlightStore } from "./live-flight-store.js";

const LiveContext = createContext<LiveFlightStore | null>(null);
export function LiveFlightProvider({
  children,
  store,
}: {
  readonly children: ReactNode;
  readonly store?: LiveFlightStore;
}) {
  const [ownedStore] = useState(createLiveFlightStore);
  return <LiveContext.Provider value={store ?? ownedStore}>{children}</LiveContext.Provider>;
}
export function useFlightPosition(aircraftId: string) {
  const store = useContext(LiveContext);
  if (store === null) throw new Error("Flight subscriptions require LiveFlightProvider.");
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(aircraftId, listener),
    [store, aircraftId],
  );
  const snapshot = useCallback(() => store.getPosition(aircraftId), [store, aircraftId]);
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
