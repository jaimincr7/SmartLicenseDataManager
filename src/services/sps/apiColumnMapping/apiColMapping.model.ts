import { ISearch } from '../../../common/models/common';

export interface ISearchAPIColMapping extends ISearch {
  is_lookup?: boolean;
}

export interface IAPIColMapping {
  id?: number;
  table_name: string;
  api_id: number;
  mapping: string;
  api_name: string;
}

export interface ISearchAPIColumn {
  id: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
}

export interface ISaveApiColumnMapping {
  id: number;
  table_name: string;
  api_id: number;
  mapping: string;
}
