class AuthService {
  getAuthToken = async () => {
    const authToken = localStorage.getItem('accessToken');
    return authToken || null;
  };
}

export default new AuthService();
