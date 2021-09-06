import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbUser } from '../../../services/cmdb/user/user.model';

export interface ICmdbUserState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbUser[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbUser;
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
