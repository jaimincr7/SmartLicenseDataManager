import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IRole {
  [x: string]: any;
  id?: number;
  role_name: string;
  tenant_id: number;
  role_key?: string;
  date_added?: string | Moment;
}

export interface ISearchRole extends ISearch {
  is_lookup?: boolean;
}
