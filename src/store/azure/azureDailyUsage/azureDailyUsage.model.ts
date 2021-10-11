import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAzureDailyUsage } from '../../../services/azure/azureDailyUsage/azureDailyUsage.model';

export interface IAzureDailyUsageState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAzureDailyUsage[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAzureDailyUsage;
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
  processData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
