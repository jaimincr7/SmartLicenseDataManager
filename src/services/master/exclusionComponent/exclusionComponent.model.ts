import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigExclusionComponent {
  [x: string]: any;
  id?: number;
  component_id: number;
  exclusion_id_component_table_column_id?: number;
  exclusion_desc_component_table_column_id?: number;
  date_added?: string | Moment;
}

export interface ISearchConfigExclusionComponent extends ISearch {
  is_lookup?: boolean;
}
