import { ISearch } from '../../../common/models/common';

export interface IBU {
  id?: number;
  name?: string;
  active?: boolean;
  company_id?: number;
  tenant_id?: number;
}

export interface ISearchBU extends ISearch {}
