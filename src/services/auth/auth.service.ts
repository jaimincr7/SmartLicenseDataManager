import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { toast } from 'react-toastify';
import { loginRequest, msalInstance } from '../../utils/authConfig';

class AuthService {
  getAuthToken = async () => {
    const instance = msalInstance;
    let account = msalInstance.getActiveAccount();
    if (!account) {
      await msalInstance.loginPopup(loginRequest).catch((e: Error) => {
        toast.error(e.message);
      });
      account = msalInstance.getActiveAccount();
      if (!account) {
        window.location.reload();
        return false;
      }
    }

    const request = {
      ...loginRequest,
      account: account,
    } as any;

    return instance
      .acquireTokenSilent(request)
      .then((response) => {
        return response.accessToken;
      })
      .catch((e) => {
        if (e instanceof InteractionRequiredAuthError) {
          if (account) {
            instance.acquireTokenPopup(request).then((response) => {
              return response.accessToken;
            });
          }
        }
      });
  };
}

export default new AuthService();
