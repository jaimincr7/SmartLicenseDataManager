import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiOauthUrlInjectionSite {
  id?: number;
  inj_site?: string;
  inj_param_id?: string;
  param?: string;
  api_type_id?: number;
  date_added?: string | Moment;
}

export interface ISearchSpsApiOauthUrlInjectionSite extends ISearch {
  is_lookup?: boolean;
}
