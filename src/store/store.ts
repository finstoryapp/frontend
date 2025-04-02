import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./slices/accountsSlice/accountsSlice";
import userReducer from "./slices/userSlice/userSlice";
import navbarReducer from "./slices/navbarSlice/navbarSlice";
import expensesReducer from "./slices/expensesSlice/expensesSlice";

// redux-persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

// set up the redux-persist for the navbar
const persistedNavbarReducer = persistReducer(persistConfig, navbarReducer);

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    user: userReducer,
    navbar: persistedNavbarReducer,
    expenses: expensesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
