import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISoftware } from '../../../services/inventory/software/software.model';

export interface ISoftwareState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISoftware[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISoftware;
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
