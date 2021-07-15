import { IMenuRightsByRoleId } from '../../services/user/menu/menu.model';

export interface IActiveAccount {
  name?: string;
  email?: string;
}

export interface IUserState {
  activeAccount: IActiveAccount;
  getMenuRight: {
    loading: boolean;
    hasErrors: boolean;
    data: IMenuRightsByRoleId;
    sideBarData: any;
  };
}
