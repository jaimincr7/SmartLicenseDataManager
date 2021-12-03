import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISqlServerInventory {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  date_added?: string | Moment;
  sql_cluster?: string;
  host?: string;
  device_name?: string;
  device_type?: string;
  product_family?: string;
  version?: string;
  edition?: string;
  device_state?: string;
  software_state?: string;
  cluster?: string;
  source?: string;
  operating_system?: string;
  os_type?: string;
  tenant_id?: number;
  tenant_name?: string;
  raw_software_title?: string;
  product_name?: string;
  fqdn?: string;
  service?: string;
  cost_code?: string;
  line_of_business?: string;
  market?: string;
  application?: string;
  data_center?: string;
  serial_number?: string;
  sql_cluster_node_type?: string;
  cores?: number;
  procs?: number;
  vCPU?: number;
  ha_enabled?: boolean;
  azure_hosted?: boolean;
}

export interface ISearchSqlServerInventory extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  set_device_states?: boolean;
  set_device_states_inc_non_prod?: boolean;
  set_device_states_by_keyword?: boolean;
  x_ref_ad?: boolean;
  x_ref_azure?: boolean;
  set_desktop_non_prod?: boolean;
  update_rv_tools_vm?: boolean;
  update_rv_tools_host?: boolean;
  apply_overrides?: boolean;
}
