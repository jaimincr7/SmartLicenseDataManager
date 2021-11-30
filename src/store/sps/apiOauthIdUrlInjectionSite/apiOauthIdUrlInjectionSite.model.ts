import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiOauthIdUrlInjectionSite } from '../../../services/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.model';

export interface ISpsApiOauthIdUrlInjectionSiteState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauthIdUrlInjectionSite[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiOauthIdUrlInjectionSite;
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
