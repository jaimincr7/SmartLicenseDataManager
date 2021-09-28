import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISlim360O365Licenses {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  azure_id?: string;
  azure_tenant_id: string;
  sku_id?: string;
  sku_name?: string;
  sku_part_number?: string;
  applies_to?: string;
  purchased?: number;
  consumed?: number;
  available?: number;
  suspended?: number;
  warning?: number;
  baseline?: number;
  cost?: number;
  item_cost?: number;
  expiration_date?: string | Moment;
  payment_cycle?: string;
  plans?: string;
  committed_year_1?: number;
  committed_year_2?: number;
  committed_year_3?: number;
  year_1_item_cost?: number;
  year_2_item_cost?: number;
  year_3_item_cost?: number;
  future_item_cost?: number;
  csp_item_cost?: number;
  current_year_item_cost?: number;
  current_year_committed?: number;
  current_avg_price?: number;
  current_purchase_cost?: number;
  date_added?: string | Moment;
}

export interface ISearchSlim360O365Licenses extends ISearch {
  is_lookup?: boolean;
}
