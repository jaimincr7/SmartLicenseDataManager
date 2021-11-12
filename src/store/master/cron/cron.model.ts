import { ICron, ICronData } from '../../../services/master/cron/cron.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ILookup } from '../../../services/common/common.model';

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
    data: ICronData;
  };
  startApi: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  startAllApi: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  FrequencyDay: {
    week: ILookup[];
    month: ILookup[];
    loading: boolean;
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
