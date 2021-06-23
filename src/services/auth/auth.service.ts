import { azureAuthProvider } from './../../utils/azureProvider';

class AuthService {
  async getAuthToken() {
    const authToken = await azureAuthProvider.getIdToken();
    return authToken ? authToken.idToken.rawIdToken : null;
  }
}

export default new AuthService();
