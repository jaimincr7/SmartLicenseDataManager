import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigProcessors {
  [x: string]: any;
  id?: number;
  processor_desc: string;
  cores: number;
  date_added?: string | Moment;
}

export interface ISearchConfigProcessors extends ISearch {
  is_lookup?: boolean;
}
