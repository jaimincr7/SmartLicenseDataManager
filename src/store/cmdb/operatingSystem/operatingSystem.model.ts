import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbOperatingSystem } from '../../../services/cmdb/operatingSystem/operatingSystem.model';

export interface ICmdbOperatingSystemState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbOperatingSystem[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbOperatingSystem;
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
