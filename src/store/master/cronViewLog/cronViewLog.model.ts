import { ICron } from '../../../services/master/cron/cron.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface ICronState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICron[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICron;
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
