import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigWindowsServerEditions } from '../../../services/master/windowsServerEditions/windowsServerEditions.model';

export interface IConfigWindowsServerEditionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigWindowsServerEditions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigWindowsServerEditions;
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
