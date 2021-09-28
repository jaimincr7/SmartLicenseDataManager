import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiGroup } from '../../../services/sps/apiGroup/apiGroup.model';

export interface ISpsApiGroupState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiGroup[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiGroup;
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
