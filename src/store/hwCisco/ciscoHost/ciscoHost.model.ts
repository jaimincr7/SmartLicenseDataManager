import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoHost } from '../../../services/hwCisco/ciscoHost/ciscoHost.model';

export interface ICiscoHostState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoHost[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoHost;
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
