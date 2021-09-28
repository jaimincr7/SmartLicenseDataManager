import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigOnlineProductServicePlans {
  [x: string]: any;
  id?: number;
  product_id?: number;
  service_plan_id?: number;
  date_added?: string | Moment;
}

export interface ISearchConfigOnlineProductServicePlans extends ISearch {
  is_lookup?: boolean;
}
