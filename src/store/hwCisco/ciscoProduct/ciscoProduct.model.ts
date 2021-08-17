import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoProduct } from '../../../services/hwCisco/ciscoProduct/ciscoProduct.model';

export interface ICiscoProductState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoProduct[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoProduct;
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
