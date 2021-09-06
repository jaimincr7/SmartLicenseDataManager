import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigExclusionOperation } from '../../../services/master/exclusionOperation/exclusionOperation.model';

export interface IConfigExclusionOperationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionOperation[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionOperation;
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
