import { ISearch } from '../../common/models/common';

export interface ISqlServer {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  date_added?: Date;
  sql_cluster?: string;
  host?: string;
  device_name?: string;
  device_type?: string;
  product_family?: string;
  version?: string;
  edition?: string;
  device_state?: string;
  software_state?: string;
  cluster?: string;
  source?: string;
  operating_system?: string;
  os_type?: string;
  tenant_id?: number;
  tenant_name?: string;
  raw_software_title?: string;
  product_name?: string;
  fqdn?: string;
  service?: string;
  cost_code?: string;
  line_of_business?: string;
  market?: string;
  application?: string;
  data_center?: string;
  serial_number?: string;
  sql_cluster_node_type?: string;
}

export interface ISearchSqlServer extends ISearch {
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
