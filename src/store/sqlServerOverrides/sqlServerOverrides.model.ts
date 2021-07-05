import { IDropDownOption } from '../../common/models/common';
import { ISqlServerOverrides } from '../../services/sqlServerOverrides/sqlServerOverrides.model';

export interface ISqlServerOverridesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerOverrides[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerOverrides;
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
