import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigSqlServerServices {
  [x: string]: any;
  id?: number;
  service?: string;
  date_added?: string | Moment;
}

export interface ISearchConfigSqlServerServices extends ISearch {
  is_lookup?: boolean;
}
