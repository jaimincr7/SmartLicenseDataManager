import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoSNTC } from '../../../services/hwCisco/ciscoSNTC/ciscoSNTC.model';

export interface ICiscoSNTCState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoSNTC[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoSNTC;
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
