import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigSqlServerEditions {
  [x: string]: any;
  id?: number;
  edition?: string;
  licensable?: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigSqlServerEditions extends ISearch {
  is_lookup?: boolean;
}
