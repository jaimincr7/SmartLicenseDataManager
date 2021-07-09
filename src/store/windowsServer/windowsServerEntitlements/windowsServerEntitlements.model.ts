import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IWindowsServerEntitlements } from '../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.model';

export interface IWindowsServerEntitlementsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerEntitlements[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerEntitlements;
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
