import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigWindowsServerLicense } from '../../../services/master/windowsServerLicense/windowsServerLicense.model';

export interface IConfigWindowsServerLicenseState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigWindowsServerLicense[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigWindowsServerLicense;
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
