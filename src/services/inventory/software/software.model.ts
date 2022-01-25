import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISoftware {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  device_name?: string;
  publisher?: string;
  software_title?: string;
  software_version?: string;
  last_scan_date?: string;
  serial_number?: string;
  date_added?: string | Moment;
}

export interface ISearchSoftware extends ISearch {
  is_lookup?: boolean;
}
