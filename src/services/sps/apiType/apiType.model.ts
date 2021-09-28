import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiType {
  id?: number;
  name: string;
  route: string;
  url?: string;
  api_group_id?: number;
  base_urls?: string;
  date_added?: string | Moment;
}

export interface ISearchSpsApiType extends ISearch {
  is_lookup?: boolean;
}
