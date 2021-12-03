import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ILookup } from '../../../services/common/common.model';
import {
  IMenu,
  IMenuRightsByCompanyId,
  IMenuRightsByRoleId,
} from '../../../services/administration/menu/menu.model';

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
  addParentMenu: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  deleteParentMenu: {
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
    data: ILookup[];
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
