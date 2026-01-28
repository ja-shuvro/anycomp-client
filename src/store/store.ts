import { configureStore } from '@reduxjs/toolkit';

import specialistsReducer from './slices/specialistsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    specialists: specialistsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
