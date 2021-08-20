import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsPurchaseLineItem } from '../../../services/cms/purchaseLineItem/purchaseLineItem.model';

export interface ICmsPurchaseLineItemState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsPurchaseLineItem[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsPurchaseLineItem;
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
