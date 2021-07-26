import { ISearch } from '../../../common/models/common';

export interface ITabVInfo {
  id?: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  vm?: string;
  dns_name?: string;
  power_state?: string;
  guest_state?: string;
  cpus?: number;
  data_center?: string;
  cluster?: string;
  host?: string;
  os?: string;
  customer_id?: string;
  s_id?: string;
  os_according_to_the_configuration_file?: string;
  os_according_to_the_vm_ware_tools?: string;
  vm_uuid?: string;
  vmc?: boolean;
  cpu_size_recommendation?: number;
  tenant_id?: number;
}

export interface ISearchTabVInfo extends ISearch {
  is_lookup?: boolean;
}
