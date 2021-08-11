import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsCategory {
  id?: number;
  name?: string;
  date_added?: string | Moment;
}

export interface ISearchCmsCategory extends ISearch {
  is_lookup?: boolean;
}
