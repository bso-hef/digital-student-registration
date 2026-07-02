"use client";

import { useSyncExternalStore } from "react";

import {
  type DeviceState,
  type DeviceStore,
  createDeviceDetector,
  getSSRDefaults,
} from "device-type-detection";

// device-type-detection v2 dropped its built-in React hook in favour of a
// framework-agnostic store (createDeviceDetector → getState/subscribe/destroy).
// We keep a single shared detector for the whole app and re-expose the previous
// hook API via useSyncExternalStore. getState() returns a referentially stable
// snapshot (it only changes on a real resize/orientation event), so it satisfies
// the getSnapshot caching contract.
let detector: DeviceStore | null = null;

function getDetector(): DeviceStore | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!detector) {
    detector = createDeviceDetector();
  }
  return detector;
}

const serverSnapshot = getSSRDefaults();

const subscribe = (onStoreChange: () => void): (() => void) => {
  const store = getDetector();
  if (!store) {
    return () => {};
  }
  return store.subscribe(onStoreChange);
};

const getSnapshot = (): DeviceState => {
  const store = getDetector();
  return store ? store.getState() : serverSnapshot;
};

const getServerSnapshot = (): DeviceState => serverSnapshot;

export function useDeviceTypeDetection(): DeviceState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
