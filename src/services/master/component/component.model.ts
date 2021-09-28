import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigComponent {
  [x: string]: any;
  id?: number;
  name?: string;
  date_added?: string | Moment;
}

export interface ISearchConfigComponent extends ISearch {
  is_lookup?: boolean;
}
