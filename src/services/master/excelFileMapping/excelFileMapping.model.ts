import { ISearch } from '../../../common/models/common';

export interface IExcelFileMapping {
  id?: number;
  key_word: string;
  is_public: boolean;
  company_id: number;
  bu_id: number;
  tenant_id: number;
  created_by: number;
  file_type: string;
  delimiter: string;
}

export interface ISearchExcelFileMapping extends ISearch {
  is_lookup?: boolean;
}
