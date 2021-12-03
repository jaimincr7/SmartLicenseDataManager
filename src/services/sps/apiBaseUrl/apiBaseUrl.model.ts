import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiBaseUrl {
  id?: number;
  base_url_name?: string;
  group_id?: number;
  enabled?: boolean;
  date_added?: string | Moment;
}

export interface ISearchSpsApiBaseUrl extends ISearch {
  is_lookup?: boolean;
}
