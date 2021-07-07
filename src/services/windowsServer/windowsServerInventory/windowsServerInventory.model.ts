import { ISearch } from '../../../common/models/common';

export interface IWindowsServerInventory {
  id?: number;
  company_id?: number;
  bu_id?: number;
  host: string;
  procs?: number;
  cores?: number;
  device_name: string;
  device_type: string;
  product_family: string;
  version: string;
  edition: string;
  vCPU?: number;
  ha_enabled?: boolean;
  device_state: string;
  software_state: string;
  cluster: string;
  source: string;
  operating_system: string;
  tenant_id: number;
  fqdn: string;
  cost_code: string;
  line_of_business: string;
  application: string;
  data_center: string;
  serial_number: string;
  drs_enabled?: boolean;
  exempt?: boolean;
  sc_exempt?: boolean;
  azure_hosted?: boolean;
  sc_server?: boolean;
  sc_agent?: boolean;
  sc_version?: string;
  market?: string;
}

export interface ISearchWindowsServerInventory extends ISearch {
  is_lookup?: boolean;
}
