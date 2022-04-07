import { Moment } from 'moment';
import { ISearch } from '../../common/models/common';

export interface IBackgroundProcesses {
  id?: number;
  type: string;
  status: string;
  comment?: string;
  json: string;
  start_date?: string | Moment;
  complete_date?: string | Moment;
  company_id?: number;
  bu_id?: number;
  tenant_id: number;
  user_id: number;
  date_added?: string | Moment;
}

export interface ISearchBackgroundProcesses extends ISearch {
  is_lookup?: boolean;
}
