import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigOnlineProducts } from '../../../services/master/onlineProducts/onlineProducts.model';

export interface IConfigOnlineProductsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigOnlineProducts[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigOnlineProducts;
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
