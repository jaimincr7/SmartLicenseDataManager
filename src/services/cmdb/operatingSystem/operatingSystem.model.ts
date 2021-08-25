import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbOperatingSystem {
  id?: number;
  name?: string;
  manufacturer?: string;
  version?: string;
  build_number?: string;
  serial_number?: string;
  is_oem?: boolean;
  is_server?: boolean;
  date_added?: string | Moment;
}

export interface ISearchCmdbOperatingSystem extends ISearch {
  is_lookup?: boolean;
}
