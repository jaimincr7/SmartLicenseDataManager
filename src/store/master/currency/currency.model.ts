import { ICurrency } from '../../../services/master/currency/currency.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface ICurrencyState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICurrency[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICurrency;
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
