import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IInventory {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  publisher?: string;
  software_title?: string;
  software_version?: string;
  product_id?: string;
  device_name?: string;
  domain_name?: string;
  operating_system?: string;
  manufacturer?: string;
  device_model?: string;
  device_serial?: string;
  processor_desc?: string;
  processor_count?: number;
  cores_per_processor?: number;
  core_count?: number;
  username?: string;
  last_hw_scan?: string | Moment;
  last_sw_scan?: string | Moment;
  date_installed?: string | Moment;
  is_virtual?: boolean;
  software_normalization_id?: number;
  operating_system_normalization_id?: number;
  os?: string;
  instance_count?: number;
  quantity?: number;
  exclude?: string;
  on_server?: string;
  date_added?: string | Moment;
}

export interface ISearchInventory extends ISearch {
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
