import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import {
  IMenu,
  IMenuRightsByCompanyId,
  IMenuRightsByRoleId,
} from '../../../services/user/menu/menu.model';
import { IRoleLookup } from '../../../services/user/user.model';

export interface IMenuState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IMenu[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IMenu;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  getMenuRightsByRoleId: {
    loading: boolean;
    hasErrors: boolean;
    data: IMenuRightsByRoleId;
  };
  saveMenuAccessRights: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  getMenuRightsByCompanyId: {
    loading: boolean;
    hasErrors: boolean;
    data: IMenuRightsByCompanyId;
  };
  saveCompanyMenuAccessRights: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  roleLookup: {
    data: IRoleLookup[];
    loading: boolean;
  };
  getMenuAccessRights: {
    loading: boolean;
    hasErrors: boolean;
    data: IMenuRightsByCompanyId;
  };
  saveAddRemoveMenuAccessRights: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
