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
}

export interface IDeleteDataset {
  table_name: string;
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  debug?: boolean;
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
