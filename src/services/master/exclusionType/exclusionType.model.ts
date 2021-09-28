import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigExclusionType {
  [x: string]: any;
  id?: number;
  name: string;
  is_enabled: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigExclusionType extends ISearch {
  is_lookup?: boolean;
}
