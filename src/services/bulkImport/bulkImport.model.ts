export interface IImportDataTable {
  table_names: string[];
}

export interface IDataTable {
  name: string;
}

export interface IDataTableForImport {
  name: string;
  is_available: boolean;
}

export interface IGetExcelMapping {
  table_name: string;
  key_word: string;
  file_type: string;
}

export interface IConfigColMapping {
  id?: number;
  sheet_name: string;
  header_row: number;
  mapping: string;
  table_name?: string;
  is_dynamic_header?: boolean;
  excel_file_mapping_id?: number;
}

export interface ISaveExcelMapping {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id: number;
  file_type: string;
  key_word: string;
  is_public: boolean;
  delimiter?: string;
  config_excel_column_mappings: IConfigColMapping[];
}
