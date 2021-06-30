import { PublicClientApplication } from '@azure/msal-browser';
import config from './config';

export const msalConfig = {
  auth: {
    authority: 'https://login.microsoftonline.com/organizations',
    clientId: config.msalClientId,
    postLogoutRedirectUri: config.msalRedirectUri,
    redirectUri: config.msalRedirectUri,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: [config.msalScopes, 'openid', 'email'],
};

export const msalInstance = new PublicClientApplication(msalConfig);
