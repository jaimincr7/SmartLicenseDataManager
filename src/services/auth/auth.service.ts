import { AuthenticationState } from 'react-aad-msal';
import { azureAuthProvider } from './../../utils/azureProvider';
import { azureAuthStore } from '../../store/auth/azureAuth.store';

class AuthService {
  isLogin() {
    const storageState = azureAuthStore.getState();
    if (storageState?.state === AuthenticationState.Authenticated) {
      return true;
    }
    return false;
  }

  async getAuthToken() {
    if (!this.isLogin()) {
      return null;
    }
    const authToken = await azureAuthProvider.getIdToken();
    return authToken ? authToken.idToken.rawIdToken : null;
  }
}

export default new AuthService();
