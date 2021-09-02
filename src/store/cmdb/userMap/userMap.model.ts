import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbUserMap } from '../../../services/cmdb/userMap/userMap.model';

export interface ICmdbUserMapState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbUserMap[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbUserMap;
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
