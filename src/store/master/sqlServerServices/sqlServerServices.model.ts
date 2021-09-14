import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigSqlServerServices } from '../../../services/master/sqlServerServices/sqlServerServices.model';

export interface IConfigSqlServerServicesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerServices[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSqlServerServices;
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
