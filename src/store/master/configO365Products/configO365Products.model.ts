import { IConfigO365Products } from '../../../services/master/configO365Products/configO365Products.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface IConfigO365ProductsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigO365Products[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigO365Products;
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
