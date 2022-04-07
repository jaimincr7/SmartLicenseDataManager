import { IDropDownOption, ITableColumnSelection } from '../../common/models/common';
import { IBackgroundProcesses } from '../../services/backgroundProcesses/backgroundProcesses.model';

export interface IBackgroundProcessesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IBackgroundProcesses[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IBackgroundProcesses;
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
