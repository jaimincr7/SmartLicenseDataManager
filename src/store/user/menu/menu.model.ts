import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IMenu, IMenuRightsByRoleId } from '../../../services/user/menu/menu.model';

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
}
