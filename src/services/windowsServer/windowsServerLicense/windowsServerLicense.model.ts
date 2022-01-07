import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface IWindowsServerLicense {
  id?: number;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
  opt_agreement_type?: number;
  opt_exclude_non_prod?: boolean;
  opt_default_to_data_center_on_hosts?: boolean;
  notes?: string;
  opt_entitlements?: boolean;
  selected_date?: string | Moment;
}

export interface ISearchWindowsServerLicense extends ISearch {
  is_lookup?: boolean;
}

export interface IReRunAllScenarios {
  company_id?: number;
  bu_id?: number;
  debug?: boolean;
  selected_date?: string | Moment;
}
