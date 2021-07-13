import { IBU } from '../../../services/master/bu/bu.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface IBUState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IBU[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IBU;
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
