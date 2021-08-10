import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICiscoHost {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  child_relationship?: string;
  product_id?: string;
  serial_number?: string;
  instance_id?: string;
  parent_sn?: string;
  parent_instance_id?: string;
  parent_child_relationship?: string;
  uid?: string;
  parent_child_indicator?: string;
  hosp_code?: string;
  status?: string;
  host_name?: string;
  ip?: string;
  snmp?: string;
  stack?: number;
  previous_host_name?: string;
  network_device_type?: string;
  date_added?: string | Moment;
}

export interface ISearchCiscoHost extends ISearch {
  is_lookup?: boolean;
}
