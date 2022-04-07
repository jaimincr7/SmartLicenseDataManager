import { ISearch } from '../../../common/models/common';

export interface IExcelColumnMapping {
  id?: number;
  excel_file_mapping_id: number;
  sheet_name: string;
  header_row: number;
  mapping: string;
  table_name: string;
}

export interface ISearchExcelColumnMapping extends ISearch {
  is_lookup?: boolean;
}
