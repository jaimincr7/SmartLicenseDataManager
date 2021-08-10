import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoIB } from '../../../services/hwCisco/ciscoIB/ciscoIB.model';

export interface ICiscoIBState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoIB[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoIB;
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
