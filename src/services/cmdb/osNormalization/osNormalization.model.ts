import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbOsNormalization {
  id?: number;
  operating_system_raw?: string;
  device_type?: string;
  family?: string;
  publisher?: string;
  edition?: string;
  edition_index?: number;
  version?: string;
  version_index?: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbOsNormalization extends ISearch {
  is_lookup?: boolean;
}
