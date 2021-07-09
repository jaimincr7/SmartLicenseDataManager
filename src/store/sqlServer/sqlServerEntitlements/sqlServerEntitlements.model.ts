import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISqlServerEntitlements } from '../../../services/sqlServer/sqlServerEntitlements/sqlServerEntitlements.model';

export interface ISqlServerEntitlementsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerEntitlements[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerEntitlements;
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
