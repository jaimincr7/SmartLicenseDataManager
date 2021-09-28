import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface ICompany {
  [x: string]: any;
  id?: number;
  name?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  fax?: string;
  email?: string;
  joined_date?: string | Moment;
  active?: boolean;
  tenant_id?: number;
  tenant_name?: string;
  currency_id?: number;
  currency?: string;
}

export interface ISearchCompany extends ISearch {}
