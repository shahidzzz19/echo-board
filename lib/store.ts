// lib/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { contentApi } from './api/contentApi'; // RTK Query API slice
import contentReducer from './slices/contentSlice';
import searchReducer from './slices/searchSlice';
import userReducer from './slices/userSlice';

// ✅ SSR-safe storage
const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

// ✅ Persist config
const persistConfig = {
  key: 'root',
  storage: typeof window !== 'undefined' ? storage : createNoopStorage(),
  whitelist: ['user'], // persist only the user slice
};

// ✅ Root reducer
const rootReducer = combineReducers({
  content: contentReducer,
  user: userReducer,
  search: searchReducer,
  [contentApi.reducerPath]: contentApi.reducer, // include RTK Query reducer
});

// ✅ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(contentApi.middleware), // add RTK Query middleware
});

// ✅ Persistor
export const persistor = persistStore(store);

// ✅ Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
