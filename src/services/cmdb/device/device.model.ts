import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbDevice {
  id?: number;
  source?: string;
  last_updated?: string | Moment;
  computer_name?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  architecture?: string;
  bios_manufacturer?: string;
  bios_serial?: string;
  bios_version?: string;
  host_name?: string;
  hypervisor_name?: string;
  is_virtual?: boolean;
  is_vdi?: boolean;
  is_server?: boolean;
  is_host?: boolean;
  is_tablet?: boolean;
  is_portable?: boolean;
  tenant_id: number;
  operating_system_id?: number;
  processor_id?: number;
  virtualization_id?: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbDevice extends ISearch {
  is_lookup?: boolean;
}
