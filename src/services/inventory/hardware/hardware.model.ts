import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IHardware {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  device_name?: string;
  serial_number?: string;
  manufacturer?: string;
  model?: string;
  operating_system?: string;
  processor_type?: string;
  number_of_processors?: number;
  cores_per_processor?: number;
  last_scan_date?: string;
  last_logged_on_user?: string;
  location?: string;
  is_virtual?: string;
  date_added?: string | Moment;
}

export interface ISearchHardware extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  selected_date_ws: string | Moment;
}
