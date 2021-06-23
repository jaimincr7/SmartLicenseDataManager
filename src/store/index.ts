import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './combined.reducers';
import { AuthenticationActions } from 'react-aad-msal';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: [
        ...Object.keys(AuthenticationActions).map((key) => AuthenticationActions[key]),
      ],
      ignoredPaths: ['azureAuth'],
    },
  }),
});
