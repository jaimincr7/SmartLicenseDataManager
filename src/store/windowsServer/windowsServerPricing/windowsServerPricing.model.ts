import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IWindowsServerPricing } from '../../../services/windowsServer/windowsServerPricing/windowsServerPricing.model';

export interface IWindowsServerPricingState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerPricing[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
    currency_id: number;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerPricing;
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
