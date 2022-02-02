import { ISearch } from '../../../common/models/common';

export interface IDeleteDataset {
  id?: number;
  table_name: string;
  store_procedure_name: string;
  is_date_available: boolean;
}

export interface ISearchDeleteDataset extends ISearch {}
