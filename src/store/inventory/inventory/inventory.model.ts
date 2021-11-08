import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IInventory } from '../../../services/inventory/inventory/inventory.model';

export interface IInventoryState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IInventory[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IInventory;
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
