import { ITenant } from './../../../services/master/tenant/tenant.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface ITenantState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ITenant[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ITenant;
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
