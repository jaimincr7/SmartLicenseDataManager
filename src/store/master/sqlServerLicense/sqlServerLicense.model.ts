import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigSqlServerLicense } from '../../../services/master/sqlServerLicense/sqlServerLicense.model';

export interface IConfigSqlServerLicenseState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerLicense[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerLicense;
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
