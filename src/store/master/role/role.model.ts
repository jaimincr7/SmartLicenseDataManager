import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IRole } from '../../../services/master/role/role.model';

export interface IRoleState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IRole[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IRole;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
