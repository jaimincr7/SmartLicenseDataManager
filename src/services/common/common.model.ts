import { Moment } from 'moment';
export interface ILookup {
  id: number;
  name: string;
}

export interface IExcelToSqlData {
  key: string;
  value: string;
}

export interface IBulkInsertDataset {
  excel_to_sql_mapping?: Array<IExcelToSqlData>;
  table_name: string;
  file_name?: string;
  sheet_name?: string;
  original_file_name?: string;
  foreign_key_values: {
    tenant_id: number;
    company_id: number;
    bu_id: number;
    date_added: string | Moment;
  };
  header_row: number;
}

export interface IDeleteDataset {
  table_name: string;
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  debug?: boolean;
}

export interface IScheduleDate {
  table_name: string;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
}

export interface IDatabaseTable {
  name: string;
}

export interface ITableColumn {
  name: string;
  is_nullable: string;
  data_type: string;
  length?: number;
}

export interface IExcelSheetColumn {
  sheet: string;
  columns: string[];
}

export interface IGetExcelColumns {
  excel_sheet_columns: IExcelSheetColumn[];
  filename: string;
}

export interface IBulkUpdate {
  table_name: string;
  update_data?: any;
  filter_keys: string;
  is_export_to_excel: boolean;
  is_column_selection?: boolean;
  keyword: string;
  limit: number;
  offset: number;
  order_by: string;
  current_user: any;
  order_direction: string;
}

export interface IBulkDelete {
  table_name: string;
  filter_keys: any;
  is_export_to_excel: boolean;
  is_column_selection?: boolean;
  keyword: string;
  limit: number;
  offset: number;
  order_by: string;
  order_direction: string;
  export_column_details?: any;
}

export interface IConfigModelPopUpDataSelection {
  id: number;
  selection: any;
  pop_up_name: string;
  table_name: string;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
}

export interface IGetConfigModelPopUpDataSelection {
  pop_up_name: string;
  table_name: string;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
}
