import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiOauthUrlInjectionSite } from '../../../services/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.model';

export interface ISpsApiOauthUrlInjectionSiteState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauthUrlInjectionSite[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauthUrlInjectionSite;
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
