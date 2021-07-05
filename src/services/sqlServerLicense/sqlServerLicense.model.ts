import { ISearch } from '../../common/models/common';

export interface ISqlServerLicense {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id: number;
  opt_agreement_type?: number;
  opt_exclude_non_prod?: boolean;
  opt_cluster_logic?: boolean;
  apt_default_to_enterprise_on_hosts?: boolean;
  notes?: string;
  opt_entitlements?: boolean;
}

export interface ISearchSqlServerLicense extends ISearch {
  is_lookup?: boolean;
  keyword?: string;
  filter_keys?: any;
  is_export_to_excel?: boolean;
}
