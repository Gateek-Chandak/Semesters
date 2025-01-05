import { configureStore, Middleware } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import authReducer from './slices/authSlice';
import termDataSyncMiddleware from './middleware/termDataSyncMiddleware';

const store = configureStore({
    reducer: {
        data: dataReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(termDataSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
