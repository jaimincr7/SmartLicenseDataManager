import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigExclusionLocation {
  [x: string]: any;
  id?: number;
  component_table_column_id: number;
  is_excludable?: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigExclusionLocation extends ISearch {
  is_lookup?: boolean;
}
