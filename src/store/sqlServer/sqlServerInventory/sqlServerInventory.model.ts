import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISqlServerInventory } from '../../../services/sqlServer/sqlServerInventory/sqlServerInventory.model';

export interface ISqlServerInventoryState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerInventory[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerInventory;
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
