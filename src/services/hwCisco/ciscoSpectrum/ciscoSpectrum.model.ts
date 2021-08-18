import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICiscoSpectrum {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  condition?: string;
  name?: string;
  network_address?: string;
  mac_address?: string;
  serial_number?: string;
  last_successful_poll?: string;
  running_firmware_tooltip?: string;
  type?: string;
  notes?: string;
  device_family?: string;
  last_capture?: string;
  manufacturer?: string;
  model_type_name?: string;
  model_class?: string;
  violated_ncm_policies?: number;
  topology_container_tooltip?: string;
  creation_time?: string;
  date_added?: string | Moment;
}

export interface ISearchCiscoSpectrum extends ISearch {
  is_lookup?: boolean;
}
