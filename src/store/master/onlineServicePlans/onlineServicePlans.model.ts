import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigOnlineServicePlans } from '../../../services/master/onlineServicePlans/onlineServicePlans.model';

export interface IConfigOnlineServicePlansState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigOnlineServicePlans[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigOnlineServicePlans;
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
