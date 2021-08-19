import { ISearch } from '../../../common/models/common';

export interface ITenant {
  id?: number;
  name: string;
  currency_id?: number;
  currency?: string;
}

export interface ISearchTenant extends ISearch {}
