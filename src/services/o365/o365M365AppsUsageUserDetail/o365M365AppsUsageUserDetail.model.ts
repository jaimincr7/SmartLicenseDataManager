import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface IO365M365AppsUsageUserDetail {
  id?: number;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
  report_refresh_date?: string | Moment;
  user_principal_name?: string;
  last_activation_date?: string | Moment;
  last_activity_date?: string | Moment;
  date_added?: string | Moment;
  report_period?: number;
  is_active_on_windows?: boolean;
  is_active_on_mac?: boolean;
  is_active_on_mobile?: boolean;
  is_active_on_web?: boolean;
  is_active_on_outlook?: boolean;
  is_active_on_word?: boolean;
  is_active_on_excel?: boolean;
  is_active_on_power_point?: boolean;
  is_active_on_one_note?: boolean;
  is_active_on_teams?: boolean;
  is_active_on_outlook_windows?: boolean;
  is_active_on_word_windows?: boolean;
  is_active_on_excel_windows?: boolean;
  is_active_on_power_point_windows?: boolean;
  is_active_on_one_note_windows?: boolean;
  is_active_on_teams_windows?: boolean;
  is_active_on_outlook_mac?: boolean;
  is_active_on_word_mac?: boolean;
  is_active_on_excel_mac?: boolean;
  is_active_on_power_point_mac?: boolean;
  is_active_on_one_note_mac?: boolean;
  is_active_on_teams_mac?: boolean;
  is_active_on_outlook_mobile?: boolean;
  is_active_on_word_mobile?: boolean;
  is_active_on_excel_mobile?: boolean;
  is_active_on_power_point_mobile?: boolean;
  is_active_on_one_note_mobile?: boolean;
  is_active_on_teams_mobile?: boolean;
  is_active_on_outlook_web?: boolean;
  is_active_on_word_web?: boolean;
  is_active_on_excel_web?: boolean;
  is_active_on_power_point_web?: boolean;
  is_active_on_one_note_web?: boolean;
  is_active_on_teams_web?: boolean;
}

export interface ISearchO365M365AppsUsageUserDetail extends ISearch {
  is_lookup?: boolean;
}
