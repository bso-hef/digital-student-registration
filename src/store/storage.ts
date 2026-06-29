import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 * Creates a noop storage for server-side rendering
 * This prevents errors when localStorage is not available (server-side)
 */
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

/**
 * SSR-safe storage for redux-persist
 * Uses localStorage in the browser, noop storage on the server
 */
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
