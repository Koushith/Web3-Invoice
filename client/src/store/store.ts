/**
 * Redux Store Configuration
 * Enterprise-grade store setup with Redux Toolkit, RTK Query, and Redux Persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { apiService } from '@/services/api.service';
import authReducer from './slices/auth.slice';

// ==================== Persist Configuration ====================

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiService.reducerPath], // Don't persist API cache
};

// ==================== Root Reducer ====================

const rootReducer = combineReducers({
  auth: authReducer,
  [apiService.reducerPath]: apiService.reducer,
});

// ==================== Persisted Reducer ====================

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ==================== Store Configuration ====================

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiService.middleware),
  devTools: import.meta.env.DEV,
});

// ==================== Persistor ====================

export const persistor = persistStore(store);

// ==================== Types ====================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ==================== Type-safe hooks ====================

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
