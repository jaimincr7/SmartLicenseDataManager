import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbVirtualization } from '../../../services/cmdb/virtualization/virtualization.model';

export interface ICmdbVirtualizationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbVirtualization[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbVirtualization;
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
