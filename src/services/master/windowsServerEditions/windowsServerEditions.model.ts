import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigWindowsServerEditions {
  [x: string]: any;
  id?: number;
  edition?: string;
  date_added?: string | Moment;
}

export interface ISearchConfigWindowsServerEditions extends ISearch {
  is_lookup?: boolean;
}
