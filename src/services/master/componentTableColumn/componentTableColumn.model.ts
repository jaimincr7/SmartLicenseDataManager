import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigComponentTableColumn {
  [x: string]: any;
  id?: number;
  table_name: string;
  column_name: string;
  component_id: number;
  date_added?: string | Moment;
}

export interface ISearchConfigComponentTableColumn extends ISearch {
  is_lookup?: boolean;
}
