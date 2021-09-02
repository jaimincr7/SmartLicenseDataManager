import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbLicenseModel {
  id?: number;
  name: string;
  publisher?: string;
  description?: string;
  metric?: string;
  minimum?: string;
  is_down_gradable?: boolean;
  date_added?: string | Moment;
}

export interface ISearchCmdbLicenseModel extends ISearch {
  is_lookup?: boolean;
}
