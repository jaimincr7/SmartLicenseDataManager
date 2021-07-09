import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IWindowsServerOverrides } from '../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';

export interface IWindowsServerOverridesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerOverrides[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerOverrides;
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
