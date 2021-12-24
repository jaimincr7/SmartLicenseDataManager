import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiTokenConfigOptionsV2 } from '../../../services/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.model';

export interface ISpsApiTokenConfigOptionsV2State {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiTokenConfigOptionsV2[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiTokenConfigOptionsV2;
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
