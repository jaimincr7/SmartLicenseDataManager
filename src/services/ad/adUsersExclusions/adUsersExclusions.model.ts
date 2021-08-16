import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IAdUsersExclusions {
  id?: number;
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
  field: string;
  condition: string;
  value: string;
  enabled?: boolean;
  instance_count?: number;
  decom?: boolean;
  date_added: string | Moment;
}

export interface ISearchAdUsersExclusions extends ISearch {
  is_lookup?: boolean;
}
