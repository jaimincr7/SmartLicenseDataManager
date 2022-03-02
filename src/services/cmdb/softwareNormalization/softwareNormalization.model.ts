import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbSoftwareNormalization {
  id?: number;
  software_title?: string;
  licensable?: string;
  metric?: string;
  product?: string;
  edition?: string;
  version?: string;
  publisher?: string;
  date_added?: string | Moment;
}

export interface ISearchCmdbSoftwareNormalization extends ISearch {
  is_lookup?: boolean;
}
