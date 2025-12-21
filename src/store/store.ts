import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createLogger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "../store/reducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui", "class", "dashboard", "appSettings", "auth"],
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
export type AppThunk<ReturnType = unknown> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
