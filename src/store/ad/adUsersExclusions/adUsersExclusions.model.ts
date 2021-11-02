import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAdUsersExclusions } from '../../../services/ad/adUsersExclusions/adUsersExclusions.model';
import { ILookup } from '../../../services/common/common.model';

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
  fieldLookup: {
    data: ILookup[];
    loading: boolean;
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
