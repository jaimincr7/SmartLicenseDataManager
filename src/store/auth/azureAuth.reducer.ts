import { AuthenticationActions, AuthenticationState } from 'react-aad-msal';
import { IAzureAuthState } from './azureAuth.model';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app.model';

const initialState: IAzureAuthState = {
  initializing: false,
  initialized: false,
  idToken: null,
  accessToken: null,
  state: AuthenticationState.Unauthenticated,
  account: null,
};

export const azureAuthSlice = createSlice({
  name: 'azureAuth',
  initialState,
  reducers: {},
  extraReducers: {
    [AuthenticationActions.Initializing]: (state) => {
      state.initializing = true;
      state.initialized = false;
    },
    [AuthenticationActions.Initialized]: (state) => {
      state.initializing = false;
      state.initialized = true;
    },
    [AuthenticationActions.AcquiredIdTokenSuccess]: (state, action) => {
      state.idToken = action.payload;
    },
    [AuthenticationActions.AcquiredAccessTokenSuccess]: (state, action) => {
      state.accessToken = action.payload;
    },
    [AuthenticationActions.AcquiredAccessTokenError]: (state) => {
      state.accessToken = null;
    },
    [AuthenticationActions.LoginSuccess]: (state, action) => {
      state.account = action.payload.account;
    },
    [AuthenticationActions.LoginError]: (state) => {
      state.idToken = null;
      state.accessToken = null;
      state.account = null;
    },
    [AuthenticationActions.AcquiredIdTokenError]: (state) => {
      state.idToken = null;
      state.accessToken = null;
      state.account = null;
    },
    [AuthenticationActions.LogoutSuccess]: (state) => {
      state.idToken = null;
      state.accessToken = null;
      state.account = null;
    },
    [AuthenticationActions.AuthenticatedStateChanged]: (state, action) => {
      state.state = action.payload;
    },
  },
});

// A selector
export const azureAuthSelector = (state: RootState) => state.azureAuth;

// The reducer
export default azureAuthSlice.reducer;
