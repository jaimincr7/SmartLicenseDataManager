import { ISearch } from '../../common/models/common';

export interface ISqlServerOverrides {
  id?: number;
  company_id?: number;
  bu_id?: number;
  device_name?: string;
  override_field?: string;
  override_value?: string;
  enabled?: boolean;
  version?: string;
  edition?: string;
  source?: string;
  notes?: string;
  tenant_id: number;
}

export interface ISearchSqlServerOverrides extends ISearch {
  is_lookup?: boolean;
  keyword?: string;
  filter_keys?: any;
  is_export_to_excel?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  set_device_states?: boolean;
  set_device_states_inc_non_prod?: boolean;
  set_device_states_by_keyword?: boolean;
  x_ref_ad?: boolean;
  x_ref_azure?: boolean;
  set_desktop_non_prod?: boolean;
  update_rv_tools_vm?: boolean;
  update_rv_tools_host?: boolean;
  apply_overrides?: boolean;
}
