import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbExclusion } from '../../../services/cmdb/exclusion/exclusion.model';

export interface ICmdbExclusionState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbExclusion[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbExclusion;
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
