import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiOauthIdUrlInjectionSite {
  id?: number;
  oauth_id: number;
  inj_id: number;
  date_added?: string | Moment;
}

export interface ISearchSpsApiOauthIdUrlInjectionSite extends ISearch {
  is_lookup?: boolean;
}
