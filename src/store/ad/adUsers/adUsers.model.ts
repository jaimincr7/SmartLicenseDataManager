import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAdUser } from '../../../services/ad/adUsers/adUsers.model';

export interface IAdUsersState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUser[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUser;
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
  processData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
