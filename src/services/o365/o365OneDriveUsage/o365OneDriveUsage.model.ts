import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface IO365OneDriveUsage {
  id?: number;
  company_id?: number;
  bu_id?: number;
  report_refresh_date?: string | Moment;
  site_url?: string;
  owner_display_name?: string;
  is_deleted?: boolean;
  last_activity_date?: string | Moment;
  date_added?: string | Moment;
  file_count?: number;
  active_file_count?: number;
  storage_used_byte?: number;
  storage_allocated_byte?: number;
  owner_principal_name?: string;
  report_period?: number;
  tenant_id?: number;
}

export interface ISearchO365OneDriveUsage extends ISearch {
  is_lookup?: boolean;
}
