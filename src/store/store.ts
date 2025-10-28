import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "../store/reducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui", "student", "class", "dashboard", "appSettings"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const logger = createLogger({
  duration: false,
  timestamp: false,
  level: "log",
  diff: false,
});

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    });

    if (process.env.NODE_ENV === "development") {
      middleware.push(logger);
    }

    return middleware;
  },
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export { store, persistor };
