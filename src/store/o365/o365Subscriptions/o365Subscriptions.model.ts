import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365Subscriptions } from '../../../services/o365/o365Subscriptions/o365Subscriptions.model';

export interface IO365SubscriptionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365Subscriptions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365Subscriptions;
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
