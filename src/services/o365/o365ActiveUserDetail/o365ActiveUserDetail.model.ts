import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface IO365ActiveUserDetail {
  id?: number;
  company_id?: number;
  bu_id?: number;
  report_refresh_date?: string | Moment;
  date_added?: string | Moment;
  user_principal_name?: string;
  display_name?: string;
  is_deleted?: boolean;
  deleted_date?: string;
  has_exchange_license?: boolean;
  has_one_drive_license?: boolean;
  has_share_point_license?: boolean;
  has_skype_for_business_license?: boolean;
  has_yammer_license?: boolean;
  has_teams_license?: boolean;
  exchange_last_activity_date?: string | Moment;
  one_drive_last_activity_date?: string | Moment;
  share_point_last_activity_date?: string | Moment;
  skype_for_business_last_activity_date?: string | Moment;
  yammer_last_activity_date?: string | Moment;
  teams_last_activity_date?: string | Moment;
  exchange_license_assign_date?: string | Moment;
  one_drive_license_assign_date?: string | Moment;
  share_point_license_assign_date?: string | Moment;
  skype_for_business_license_assign_date?: string | Moment;
  yammer_license_assign_date?: string | Moment;
  teams_license_assign_date?: string | Moment;
  assigned_products?: string;
  tenant_id: number;
}

export interface ISearchO365ActiveUserDetail extends ISearch {
  is_lookup?: boolean;
}
