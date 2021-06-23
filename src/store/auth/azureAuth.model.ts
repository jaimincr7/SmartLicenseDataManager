export interface IAzureAuthState {
  initializing: boolean;
  initialized: boolean;
  idToken: string;
  accessToken: string;
  state: any;
  account: any;
}
