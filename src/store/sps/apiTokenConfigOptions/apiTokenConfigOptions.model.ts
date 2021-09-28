import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiTokenConfigOptions } from '../../../services/sps/apiTokenConfigOptions/apiTokenConfigOptions.model';

export interface ISpsApiTokenConfigOptionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiTokenConfigOptions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiTokenConfigOptions;
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
