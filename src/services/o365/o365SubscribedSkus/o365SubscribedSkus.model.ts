import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IO365SubscribedSkus {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  capability_status?: string;
  consumed_units?: number;
  response_id?: string;
  sku_id?: string;
  sku_part_number?: string;
  applies_to?: string;
  enabled?: number;
  suspended?: number;
  warning?: number;
  service_plans?: string;
  date_added?: string | Moment;
}

export interface ISearchO365SubscribedSkus extends ISearch {
  is_lookup?: boolean;
}
