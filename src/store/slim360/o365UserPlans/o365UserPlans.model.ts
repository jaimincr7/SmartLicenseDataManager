import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISlim360O365UserPlans } from '../../../services/slim360/o365UserPlans/o365UserPlans.model';

export interface ISlim360O365UserPlansState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISlim360O365UserPlans[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISlim360O365UserPlans;
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
