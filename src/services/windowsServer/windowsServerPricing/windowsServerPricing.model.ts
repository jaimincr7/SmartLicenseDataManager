import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IWindowsServerPricing {
  id?: number;
  company_id?: number;
  bu_id?: number;
  license_id?: number;
  price?: number;
  currency_id?: number;
  agreement_type_id?: number;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchWindowsServerPricing extends ISearch {
  is_lookup?: boolean;
}
