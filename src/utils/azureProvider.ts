// The auth provider should be a singleton. Best practice is to only have it ever instantiated once.
// Avoid creating an instance inside the component it will be recreated on each render.

import { LoginType, MsalAuthProvider } from 'react-aad-msal';
import config from './config';

// If two providers are created on the same page it will cause authentication errors.
export const azureAuthProvider = new MsalAuthProvider(
  {
    auth: {
      authority: 'https://login.microsoftonline.com/organizations',
      clientId: config.msalClientId,
      postLogoutRedirectUri: 'http://localhost:8080/login',
      redirectUri: config.msalRedirectUri,
      validateAuthority: true,

      // After being redirected to the "redirectUri" page, should user
      // be redirected back to the Url where their login originated from?
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  },
  {
    scopes: [config.msalScopes],
  },
  {
    loginType: LoginType.Redirect,
    // When a token is refreshed it will be done by loading a page in an iframe.
    // Rather than reloading the same page, we can point to an empty html file which will prevent
    // site resources from being loaded twice.
    tokenRefreshUri: window.location.origin + '/auth.html',
  }
);
