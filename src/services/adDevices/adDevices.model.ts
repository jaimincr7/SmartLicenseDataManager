import { ISearch } from '../../common/models/common';

export interface IAdDevices {
  id: number;
  company_id: number;
  bu_id: number;
  source: string;
  distinguished_name: string;
  dns_host_name: string;
  enabled: boolean;
  iPv4_address: string;
  last_logon: string;
  last_logon_date: Date;
  last_logon_timestamp: string;
  name: string;
  object_class: string;
  object_guid: string;
  operating_system: string;
  password_expired: boolean;
  password_last_set: Date;
  password_never_expires: boolean;
  sam_account_name: string;
  sid: string;
  user_principal_name: string;
  when_created: Date;
  device_type: string;
  exclusion: string;
  tenant_id: number;
  exclusion_id: number;
  inventoried: boolean;
  active: boolean;
  qualified: boolean;
  domain: string;
  description: string;
}

export interface ISearchAdDevices extends ISearch {
  is_lookup?: boolean;
  keyword?: string;
  filter_keys?: any;
  is_export_to_excel?: boolean;
}

export interface IDeleteDataset {
  table_name?: string;
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  debug?: boolean;
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

export interface IGetExcelColumns {
  excel_column: Array<string>;
  filename: string;
  table_column: Array<string>;
}

export interface IBulkInsertDataset {
  excel_to_sql_mapping?: Array<IExcelToSqlData>;
  table_name?: string;
  file_name?: string;
}

interface IExcelToSqlData {
  key: string;
  value: string;
}
