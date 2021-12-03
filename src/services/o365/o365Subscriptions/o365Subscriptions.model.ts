import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IO365Subscriptions {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  license_id?: number;
  price?: number;
  currency_id?: number;
  valid_qty?: number;
  date_added?: string | Moment;
}

export interface ISearchO365Subscriptions extends ISearch {
  is_lookup?: boolean;
}
