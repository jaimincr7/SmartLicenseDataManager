import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigOnlineProductServicePlans } from '../../../services/master/onlineProductServicePlans/onlineProductServicePlans.model';

export interface IConfigOnlineProductServicePlansState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigOnlineProductServicePlans[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigOnlineProductServicePlans;
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
