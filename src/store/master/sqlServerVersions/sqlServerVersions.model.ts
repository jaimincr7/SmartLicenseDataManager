import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigSqlServerVersions } from '../../../services/master/sqlServerVersions/sqlServerVersions.model';

export interface IConfigSqlServerVersionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerVersions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerVersions;
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
