'use client';

import { combineReducers, Store, UnknownAction} from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import storage from './webstorage';
import { authReducer, taskReducer } from './reducer';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['authState'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const rootReducer = combineReducers({
  taskState: taskReducer,
  authState: persistedAuthReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const persistor = persistStore(store as Store<any, UnknownAction, unknown>);