import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IO365MailboxUsage {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  report_refresh_date?: string | Moment;
  user_principal_name?: string;
  display_name?: string;
  is_deleted?: boolean;
  deleted_date?: string;
  created_date?: string | Moment;
  last_activity_date?: string | Moment;
  date_added?: string | Moment;
  item_count?: number;
  storage_used_byte?: number;
  issue_warning_quota_byte?: number;
  prohibit_send_quota_byte?: number;
  prohibit_send_receive_quota_byte?: number;
  deleted_item_count?: number;
  deleted_item_size_byte?: number;
  report_period?: number;
}

export interface ISearchO365MailboxUsage extends ISearch {
  is_lookup?: boolean;
}
