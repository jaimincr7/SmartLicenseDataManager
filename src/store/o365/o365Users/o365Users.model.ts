import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365Users } from '../../../services/o365/o365Users/o365Users.model';

export interface IO365UsersState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365Users[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365Users;
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
