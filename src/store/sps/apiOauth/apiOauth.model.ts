import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiOauth } from '../../../services/sps/apiOauth/apiOauth.model';

export interface ISpsApiOauthState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauth[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauth;
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
