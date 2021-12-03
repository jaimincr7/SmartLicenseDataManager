import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IO365Reservations {
  id?: number;
  company_id?: number;
  bu_id?: number;
  reservation_id?: string;
  date_added?: string | Moment;
  license_id?: number;
  organization?: string;
  service?: string;
  licenses?: number;
  action?: string;
  requestor?: string;
  usage_date?: string;
  usage_country?: string;
  status?: string;
  tenant_id?: number;
}

export interface ISearchO365Reservations extends ISearch {
  is_lookup?: boolean;
}
