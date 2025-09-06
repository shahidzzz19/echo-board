// lib/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for browser

// Import your slice reducers
import contentReducer from './slices/contentSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';

// ✅ Custom noop storage for SSR
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

// 1️⃣ Persist configuration
const persistConfig = {
  key: 'root',
  storage: typeof window !== 'undefined' ? storage : createNoopStorage(),
  whitelist: ['user'], // persist only user slice
};

// 2️⃣ Root reducer
const rootReducer = combineReducers({
  content: contentReducer,
  user: userReducer,
  search: searchReducer,
});

// 3️⃣ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable for redux-persist
    }),
});

// 5️⃣ Persistor
export const persistor = persistStore(store);

// 6️⃣ Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;