import { IDropDownOption } from '../../common/models/common';
import { ISqlServerExclusions } from '../../services/sqlServerExclusions/sqlServerExclusions.model';

export interface ISqlServerExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
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
}
