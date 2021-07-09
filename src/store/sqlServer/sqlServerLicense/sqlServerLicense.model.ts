import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISqlServerLicense } from '../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';

export interface ISqlServerLicenseState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerLicense[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerLicense;
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
  reRunAllScenarios: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
