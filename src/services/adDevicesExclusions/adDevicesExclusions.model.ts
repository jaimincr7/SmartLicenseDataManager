import { ISearch } from '../../common/models/common';

export interface IAdDevicesExclusions {
  id?: number;
  company_id?: number;
  bu_id?: number;
  field?: string;
  condition?: string;
  value?: string;
  desktop?: boolean;
  server?: boolean;
  unknown?: boolean;
  tenant_id?: number;
  instance_count?: number;
  decom?: boolean;
  company_name?: string;
  bu_name?: string;
  tenant_name?: string;
}

export interface ISearchAdDevicesExclusions extends ISearch {
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
