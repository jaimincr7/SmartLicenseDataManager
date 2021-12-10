import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IDevice {
  id?: number;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  name?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  operating_system?: string;
  total_cpu?: number;
  purchase_date?: string;
  user_name?: string;
  device_state?: string;
  device_type?: string;
  active_in_ad?: boolean;
  qualified_in_ad?: boolean;
  in_ad?: boolean;
  domain?: string;
  date_added?: string | Moment;
}

export interface ISearchDevice extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  selected_date_ws: Date;
  include_sc: boolean;
  selected_date_ss: Date;
  selected_date_device: Date;
}
