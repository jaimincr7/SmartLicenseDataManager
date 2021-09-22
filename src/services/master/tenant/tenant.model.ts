import { ISearch } from '../../../common/models/common';

export interface ITenant {
  [x: string]: any;
  id?: number;
  name: string;
  currency_id?: number;
  currency?: string;
}

export interface ISearchTenant extends ISearch {}
