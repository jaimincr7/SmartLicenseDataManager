import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365ProductList } from '../../../services/o365/o365ProductList/o365ProductList.model';

export interface IO365ProductListState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365ProductList[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365ProductList;
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
