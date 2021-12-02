import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface IO365ActivationsUserDetail {
  id?: number;
  company_id?: number;
  bu_id?: number;
  report_refresh_date?: string | Moment;
  user_principal_name?: string;
  display_name?: string;
  product_type?: string;
  last_activated_date?: string | Moment;
  window?: number;
  mac?: number;
  windows_10_mobile?: number;
  ios?: number;
  android?: number;
  activated_on_shared_computer?: boolean;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchO365ActivationsUserDetail extends ISearch {
  is_lookup?: boolean;
}
