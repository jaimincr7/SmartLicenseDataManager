import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigOnlineProducts {
  id?: number;
  name?: string;
  string_id?: string;
  guid?: string;
  price?: number;
  units?: string;
  enterprise_product?: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigOnlineProducts extends ISearch {
  is_lookup?: boolean;
}
