import { ISearch } from '../../../common/models/common';

export interface ITabVCluster {
  id?: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  name?: string;
  over_all_status?: string;
  num_hosts?: number;
  num_effective_hosts?: number;
  total_cpu?: number;
  num_cpu_cores?: number;
  num_v_motions?: number;
  ha_enabled?: string | boolean;
  failover_level?: number;
  drs_enabled?: string | boolean;
  drs_default_vm_behavior_value?: number;
  drs_v_motion_rate?: number;
  drs_default_vm_behavior?: string;
  data_center?: string;
  vm_sper_host?: number;
  vms?: number;
  health?: number;
  tenant_id?: number;
}

export interface ISearchTabVCluster extends ISearch {
  is_lookup?: boolean;
}
