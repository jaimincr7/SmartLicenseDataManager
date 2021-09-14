import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigWindowsServerVersions } from '../../../services/master/windowsServerVersions/windowsServerVersions.model';

export interface IConfigWindowsServerVersionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigWindowsServerVersions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigWindowsServerVersions;
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
