import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoReady } from '../../../services/hwCisco/ciscoReady/ciscoReady.model';

export interface ICiscoReadyState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoReady[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoReady;
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
