import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IUser } from '../../../services/master/user/users.model';

export interface IUserState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IUser[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IUser;
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
