import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbSoftware } from '../../../services/cmdb/software/software.model';

export interface ICmdbSoftwareState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbSoftware[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbSoftware;
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
