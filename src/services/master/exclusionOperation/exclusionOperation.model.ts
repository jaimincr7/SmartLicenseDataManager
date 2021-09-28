import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigExclusionOperation {
  [x: string]: any;
  id?: number;
  name: string;
  logical_operation?: string;
  sql_operation?: string;
  is_enabled: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigExclusionOperation extends ISearch {
  is_lookup?: boolean;
}
