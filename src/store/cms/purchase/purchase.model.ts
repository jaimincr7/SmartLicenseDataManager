import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsPurchase } from '../../../services/cms/purchase/purchase.model';

export interface ICmsPurchaseState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsPurchase[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsPurchase;
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
