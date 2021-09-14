import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigSqlServerEditions } from '../../../services/master/sqlServerEditions/sqlServerEditions.model';

export interface IConfigSqlServerEditionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerEditions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerEditions;
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
