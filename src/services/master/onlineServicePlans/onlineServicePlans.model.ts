import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigOnlineServicePlans {
  [x: string]: any;
  id?: number;
  name?: string;
  string_id?: string;
  guid?: string;
  date_added?: string | Moment;
}

export interface ISearchConfigOnlineServicePlans extends ISearch {
  is_lookup?: boolean;
}
