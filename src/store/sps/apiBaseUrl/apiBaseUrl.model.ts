import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiBaseUrl } from '../../../services/sps/apiBaseUrl/apiBaseUrl.model';

export interface ISpsApiBaseUrlState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiBaseUrl[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiBaseUrl;
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
