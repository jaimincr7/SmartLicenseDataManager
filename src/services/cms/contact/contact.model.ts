import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsContact {
  id?: number;
  name?: string;
  email?: string;
  phone_number?: string;
  date_added?: string | Moment;
}

export interface ISearchCmsContact extends ISearch {
  is_lookup?: boolean;
}
