import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365SubscribedSkus } from '../../../services/o365/o365SubscribedSkus/o365SubscribedSkus.model';

export interface IO365SubscribedSkusState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365SubscribedSkus[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365SubscribedSkus;
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
