import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiType } from '../../../services/sps/apiType/apiType.model';

export interface ISpsApiTypeState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiType[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiType;
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
