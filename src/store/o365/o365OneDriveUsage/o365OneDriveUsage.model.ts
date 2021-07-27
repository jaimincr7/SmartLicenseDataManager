import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365OneDriveUsage } from '../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.model';

export interface IO365OneDriveUsageState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365OneDriveUsage[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365OneDriveUsage;
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
