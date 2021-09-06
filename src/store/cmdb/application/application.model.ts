import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbApplication } from '../../../services/cmdb/application/application.model';

export interface ICmdbApplicationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbApplication[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbApplication;
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
