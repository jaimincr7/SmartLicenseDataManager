import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface ISqlServerLicense {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  tenant_id?: number;
  tenant_name?: string;
  opt_agreement_type?: number;
  agreement_type?: string;
  opt_exclude_non_prod?: boolean;
  opt_cluster_logic?: boolean;
  opt_default_to_enterprise_on_hosts?: boolean;
  notes?: string;
  opt_entitlements?: boolean;
  selected_date?: string | Moment;
}

export interface ISearchSqlServerLicense extends ISearch {
  is_lookup?: boolean;
}

export interface IReRunAllScenarios {
  company_id?: number;
  bu_id?: number;
  debug?: boolean;
  selected_date?: string | Moment;
}
