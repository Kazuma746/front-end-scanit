import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import des reducers
import authReducer from './slices/authSlice';
import analysisReducer from './slices/analysisSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'analysis'] // Ajouter analysis à la whitelist pour la persistance
};

const rootReducer = combineReducers({
  auth: authReducer,
  analysis: analysisReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 