import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISqlServerExclusions } from '../../../services/sqlServer/sqlServerExclusions/sqlServerExclusions.model';

export interface ISqlServerExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerExclusions;
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
