import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoPolicy } from '../../../services/hwCisco/ciscoPolicy/ciscoPolicy.model';

export interface ICiscoPolicyState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoPolicy[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoPolicy;
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
