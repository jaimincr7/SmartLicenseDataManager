export interface IActiveAccount {
  name?: string;
  email?: string;
}

export interface IUserState {
  activeAccount: IActiveAccount;
}
