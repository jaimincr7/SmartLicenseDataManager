import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365ActiveUserDetail } from '../../../services/o365/o365ActiveUserDetail/o365ActiveUserDetail.model';

export interface IO365ActiveUserDetailState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365ActiveUserDetail[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365ActiveUserDetail;
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
