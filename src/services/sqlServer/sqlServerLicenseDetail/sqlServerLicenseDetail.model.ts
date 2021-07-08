import { ISearch } from '../../../common/models/common';

export interface ISqlServerLicenseDetail {
  sql_server_license_detail_id: number;
  sql_server_license_id: number;
  company_id: number;
  bu_id?: number;
  date_added?: Date;
  opt_agreement_type?: number;
  opt_exclude_non_prod?: boolean;
  opt_cluster_logic?: boolean;
  opt_default_to_enterprise_on_hosts?: boolean;
  opt_entitlements?: boolean;
  name?: string;
  tenant_id: number;
  sql_server_id: number;
  source?: string;
  data_center?: string;
  cluster?: string;
  host?: string;
  procs?: number;
  cores?: number;
  fqdn?: string;
  device_name?: string;
  serial_number?: string;
  device_type?: string;
  raw_software_title?: string;
  product_name?: string;
  product_family?: string;
  service?: string;
  version?: string;
  edition?: string;
  vcpu?: number;
  ha_enabled?: boolean;
  device_state?: string;
  software_state?: string;
  operating_system?: string;
  os_type?: string;
  cost_code?: string;
  line_of_business?: string;
  market?: string;
  application?: string;
  orphaned_vm?: boolean;
  licensable?: boolean;
  notes?: string;
  service_id?: number;
  version_id?: number;
  edition_id?: number;
  host_max_version_id?: number;
  host_max_edition_id?: number;
  cluster_max_version_id?: number;
  cluster_max_edition_id?: number;
  cluster_seq_num?: number;
  host_seq_num?: number;
  device_seq_num?: number;
  effective_processors?: number;
  effective_cores?: number;
  effective_vcpu?: number;
  effective_vcpu_for_proc_licenses?: number;
  core_density?: number;
  excluded?: string;
  licensable_cluster_seq_num?: number;
  licensable_host_seq_num?: number;
  licensable_device_seq_num?: number;
  licensed_at?: string;
  license_type?: string;
  license_count?: number;
  license_cost?: number;
  s_license_type_device?: string;
  s_license_count_device?: number;
  s_license_cost_device?: number;
  s_license_cost_host_device_licensed?: number;
  s_license_type_host?: number;
  s_license_count_host?: number;
  s_license_cost_host?: string;
  comment?: string;
  license_id?: number;
  license_qty?: number;
  assigned_license_id?: number;
  assigned_license_qty?: number;
  requires_server_mobility?: number;
  license_requires_sa?: number;
  sql_cluster?: string;
  sql_cluster_node_type?: string;
  azure_hosted?: boolean;
}

export interface ISearchSqlServerLicenseDetail extends ISearch {
  sql_server_license_id: number;
}