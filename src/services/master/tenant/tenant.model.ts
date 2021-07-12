import { ISearch } from '../../../common/models/common';

export interface ITenant {
  id?: number;
  name: string;
}

export interface ISearchTenant extends ISearch {}
