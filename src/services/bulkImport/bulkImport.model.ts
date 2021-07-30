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
