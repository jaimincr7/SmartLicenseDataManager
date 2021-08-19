import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsCategoryExtended {
  id?: number;
  category_id: number;
  name?: string;
  date_added?: string | Moment;
}

export interface ISearchCmsCategoryExtended extends ISearch {
  is_lookup?: boolean;
}
