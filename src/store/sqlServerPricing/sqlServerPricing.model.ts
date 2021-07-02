import { IDropDownOption } from '../../common/models/common';
import { ISqlServerPricing } from '../../services/sqlServerPricing/sqlServerPricing.model';

export interface ISqlServerPricingState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerPricing[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
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
