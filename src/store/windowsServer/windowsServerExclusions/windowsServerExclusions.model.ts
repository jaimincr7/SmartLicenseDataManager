import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ILookup } from '../../../services/common/common.model';
import { IWindowsServerExclusions } from '../../../services/windowsServer/windowsServerExclusions/windowsServerExclusions.model';

export interface IWindowsServerExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  fieldLookup: {
    data: ILookup[];
    loading: boolean;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerExclusions;
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
