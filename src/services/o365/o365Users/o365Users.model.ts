import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IO365Users {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  date_added?: string | Moment;
  alternate_email_addresses?: string;
  block_credential?: boolean;
  account_enabled?: boolean;
  city?: string;
  country?: string;
  department?: string;
  display_name?: string;
  fax?: string;
  first_name?: string;
  last_dir_sync_time?: string;
  last_name?: string;
  last_password_change_timestamp?: string;
  license_assignment_details?: string;
  licenses?: string;
  mobile_phone?: string;
  oath_token_metadata?: string;
  object_id?: string;
  office?: string;
  password_never_expires?: string;
  phone_number?: string;
  postal_code?: string;
  preferred_data_location?: string;
  preferred_language?: string;
  proxy_addresses?: string;
  release_track?: string;
  soft_deletion_timestamp?: string;
  state?: string;
  street_address?: string;
  strong_password_required?: string;
  title?: string;
  usage_location?: string;
  user_principal_name?: string;
  when_created?: string;
  non_human?: boolean;
  in_ad?: boolean;
  active_in_ad?: boolean;
  ad_exclusion?: string;
  licensed?: boolean;
  dir_sync_enabled?: boolean;
  assigned_licenses?: string;
  secondary_account?: boolean;
  cost?: number;
  m365_apps_assigned?: boolean;
  project_assigned?: boolean;
  visio_assigned?: boolean;
  m365_apps_activations?: number;
  project_activations?: number;
  visio_activations?: number;
  not_in_active_users_list?: boolean;
  is_deleted?: boolean;
  no_network_access?: boolean;
  no_activity?: boolean;
  network_access?: number;
  exchange?: number;
  one_drive?: number;
  share_point?: number;
  skype_for_business?: number;
  teams?: number;
  yammer?: number;
  m365_apps?: number;
  m365_apps_mac?: boolean;
  m365_apps_windows?: boolean;
  m365_apps_mobile?: boolean;
  m365_apps_web?: boolean;
  min_last_activity?: number;
  no_activity_in_30_days?: boolean;
  license_cost?: string;
  m365_apps_outlook?: boolean;
  m365_apps_word?: boolean;
  m365_apps_excel?: boolean;
  m365_apps_power_point?: boolean;
  m365_apps_one_note?: boolean;
  m365_apps_teams?: boolean;
  assigned_plans?: string;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: any;
  table_name?: string;
}

export interface ISearchO365Users extends ISearch {
  is_lookup?: boolean;
}
