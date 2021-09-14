import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigProcessors } from '../../../services/master/processors/processors.model';

export interface IConfigProcessorsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigProcessors[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigProcessors;
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
