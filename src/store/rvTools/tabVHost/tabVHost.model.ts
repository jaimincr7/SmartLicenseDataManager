import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ITabVHost } from '../../../services/rvTools/tabVHost/tabVHost.model';

export interface ITabVHostState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVHost[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVHost;
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
