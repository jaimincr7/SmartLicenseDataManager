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
}

export interface IConfigColMapping {
  id?: number;
  sheet_name: string;
  header_row: string;
  mapping: string;
  excel_file_mapping_id?: number;
}

export interface ISaveExcelMapping {
  id?: number;
  table_name: string;
  key_word: string;
  is_public: boolean;
  config_excel_column_mappings: IConfigColMapping[];
}
