export interface FlightPosition {
  readonly aircraftId: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly observedAt: number;
}

export function createLiveFlightStore() {
  const positions = new Map<string, FlightPosition>();
  const listeners = new Map<string, Set<() => void>>();
  return {
    getPosition: (aircraftId: string): FlightPosition | undefined => positions.get(aircraftId),
    subscribe: (aircraftId: string, listener: () => void): (() => void) => {
      const subscribers = listeners.get(aircraftId) ?? new Set<() => void>();
      subscribers.add(listener);
      listeners.set(aircraftId, subscribers);
      return () => {
        subscribers.delete(listener);
        if (subscribers.size === 0) listeners.delete(aircraftId);
      };
    },
    update: (position: FlightPosition): boolean => {
      if (
        !/^[a-z0-9-]{1,32}$/u.test(position.aircraftId) ||
        !Number.isFinite(position.latitude) ||
        Math.abs(position.latitude) > 90 ||
        !Number.isFinite(position.longitude) ||
        Math.abs(position.longitude) > 180 ||
        !Number.isSafeInteger(position.observedAt) ||
        position.observedAt < 0
      ) {
        throw new RangeError("Flight position is invalid.");
      }
      const previous = positions.get(position.aircraftId);
      if (previous !== undefined && previous.observedAt >= position.observedAt) return false;
      positions.set(position.aircraftId, Object.freeze({ ...position }));
      for (const listener of listeners.get(position.aircraftId) ?? []) listener();
      return true;
    },
    remove: (aircraftId: string): void => {
      if (positions.delete(aircraftId))
        for (const listener of listeners.get(aircraftId) ?? []) listener();
    },
  };
}
export type LiveFlightStore = ReturnType<typeof createLiveFlightStore>;
