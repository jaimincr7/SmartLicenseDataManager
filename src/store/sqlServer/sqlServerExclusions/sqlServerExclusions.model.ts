import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ILookup } from '../../../services/common/common.model';
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
  fieldLookup: {
    data: ILookup[];
    loading: boolean;
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
