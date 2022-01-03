import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiOauthV2 } from '../../../services/sps/apiOauthV2/apiOauthV2.model';

export interface ISpsApiOauthV2State {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauthV2[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauthV2;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
    data: any;
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
