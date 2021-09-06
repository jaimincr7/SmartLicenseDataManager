import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigFileCategories {
  id?: number;
  name: string;
  description: string;
  date_added?: string | Moment;
}

export interface ISearchConfigFileCategories extends ISearch {
  is_lookup?: boolean;
}
