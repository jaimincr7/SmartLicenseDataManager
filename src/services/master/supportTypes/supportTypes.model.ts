import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigSupportTypes {
  [x: string]: any;
  id?: number;
  support_type?: string;
  date_added?: string | Moment;
}

export interface ISearchConfigSupportTypes extends ISearch {
  is_lookup?: boolean;
}
