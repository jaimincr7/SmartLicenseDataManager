import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365M365AppsUsageUserDetail } from '../../../services/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.model';

export interface IO365M365AppsUsageUserDetailState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365M365AppsUsageUserDetail[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365M365AppsUsageUserDetail;
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
