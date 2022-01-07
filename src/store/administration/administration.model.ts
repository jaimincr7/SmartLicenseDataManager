import { IMenuRightsByRoleId } from '../../services/administration/menu/menu.model';

export interface IActiveAccount {
  name?: string;
  email?: string;
  username?: string;
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
