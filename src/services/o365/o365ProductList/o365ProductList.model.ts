import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IO365ProductList {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  product_title?: string;
  total_licenses?: string;
  expired_licenses?: number;
  assigned_licenses?: number;
  status_message?: string;
  date_added?: string | Moment;
}

export interface ISearchO365ProductList extends ISearch {
  is_lookup?: boolean;
}
