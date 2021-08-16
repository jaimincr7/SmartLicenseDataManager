import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAdUsersExclusions } from '../../../services/ad/adUsersExclusions/adUsersExclusions.model';

export interface IAdUsersExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUsersExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUsersExclusions;
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
