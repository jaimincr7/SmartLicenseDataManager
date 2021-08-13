import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICiscoProductAttributes {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  product_id: string;
  product_description?: string;
  l_do_sales?: string | Moment;
  l_do_support?: string | Moment;
  l_do_s_category?: string;
  date_confirmed?: string | Moment;
  date_source?: string;
  asset_type?: string;
  product_type?: string;
  product_group?: string;
  product_family?: string;
  product_sub_type?: string;
  generalized_type?: string;
  software_analysis_category?: string;
  architecture_group?: string;
  architecture_sub_group?: string;
  coverage_policy?: string;
  no_coverage_reason?: string;
  hardware_list_price?: number;
  maintenance_list_price?: number;
  date_added?: string | Moment;
}

export interface ISearchCiscoProductAttributes extends ISearch {
  is_lookup?: boolean;
}
