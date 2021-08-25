import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsVendor {
  id?: number;
  name?: string;
  description?: string;
  publisher?: boolean;
  vendor?: boolean;
  date_added?: string | Moment;
}

export interface ISearchCmsVendor extends ISearch {
  is_lookup?: boolean;
}
