import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365ActivationsUserDetail } from '../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.model';

export interface IO365ActivationsUserDetailState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365ActivationsUserDetail[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365ActivationsUserDetail;
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
