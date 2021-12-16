import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISqlServerPricing } from '../../../services/sqlServer/sqlServerPricing/sqlServerPricing.model';

export interface ISqlServerPricingState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerPricing[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
    currency_id: number;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerPricing;
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
