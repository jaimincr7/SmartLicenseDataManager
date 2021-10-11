import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IWindowsServerInventory } from '../../../services/windowsServer/windowsServerInventory/windowsServerInventory.model';

export interface IWindowsServerInventoryState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerInventory[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerInventory;
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
  processData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
