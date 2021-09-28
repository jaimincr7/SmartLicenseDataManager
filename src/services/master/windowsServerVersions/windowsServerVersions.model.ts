import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigWindowsServerVersions {
  [x: string]: any;
  id?: number;
  version?: string;
  support_type_id?: number;
  date_added?: string | Moment;
}

export interface ISearchConfigWindowsServerVersions extends ISearch {
  is_lookup?: boolean;
}
